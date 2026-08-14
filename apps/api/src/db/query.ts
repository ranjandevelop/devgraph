import type { Node } from "neo4j-driver";
import { driver } from "./driver";

export async function runQuery<T = Record<string, unknown>>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T[]> {
  const session = driver.session();

  try {
    const result = await session.run(query, params);

    return result.records.map((record) => record.toObject() as T);
  } finally {
    await session.close();
  }
}

export function toProps<T>(node: Node): T {
  return node.properties as T;
}
