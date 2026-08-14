import { runQuery, toProps } from "../db/query";
import { AppError } from "../middleware/errorHandler";
import type { GraphResult, Package } from "../types/graph";
import { getPackageByName } from "./packageService";

const MAX_PATH_HOPS = 6;

export async function getDependencyGraph(name: string, depth: 1 | 2 | 3): Promise<GraphResult> {
  const root = await getPackageByName(name);

  // Cypher does not allow parameterizing variable-length relationship bounds,
  // so depth is interpolated directly. It is safe here because Zod has already
  // restricted it to the literal values 1, 2 or 3.
  const rows = await runQuery<{ from: any; to: any }>(
    `MATCH path = (root:Package {name: $name})-[:DEPENDS_ON*1..${depth}]->(:Package)
     UNWIND relationships(path) AS rel
     WITH DISTINCT startNode(rel) AS from, endNode(rel) AS to
     RETURN from, to`,
    { name },
  );

  const nodesByName = new Map<string, Package>();
  nodesByName.set(root.name, root);
  const edges: { from: string; to: string }[] = [];

  for (const row of rows) {
    const from = toProps<Package>(row.from);
    const to = toProps<Package>(row.to);
    nodesByName.set(from.name, from);
    nodesByName.set(to.name, to);
    edges.push({ from: from.name, to: to.name });
  }

  return {
    nodes: Array.from(nodesByName.values()),
    edges,
  };
}

export async function findPath(from: string, to: string): Promise<GraphResult & { hops: number }> {
  await getPackageByName(from);
  await getPackageByName(to);

  const rows = await runQuery<{ path: any }>(
    `MATCH (a:Package {name: $from}), (b:Package {name: $to})
     MATCH path = shortestPath((a)-[:DEPENDS_ON*1..${MAX_PATH_HOPS}]-(b))
     RETURN path`,
    { from, to },
  );

  if (rows.length === 0) {
    throw new AppError(404, `No connection found between "${from}" and "${to}"`);
  }

  const path = rows[0].path;
  const segments = path.segments as { start: any; end: any }[];

  const nodes = [toProps<Package>(path.start), ...segments.map((s) => toProps<Package>(s.end))];
  const edges = segments.map((s) => ({
    from: toProps<Package>(s.start).name,
    to: toProps<Package>(s.end).name,
  }));

  return { nodes, edges, hops: path.length };
}
