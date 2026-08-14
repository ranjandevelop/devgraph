"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from "d3-force";
import type { GraphResult } from "@/types/graph";

interface SimNode extends SimulationNodeDatum {
  id: string;
  downloads: number;
}

interface SimLink extends SimulationLinkDatum<SimNode> {
  source: string | SimNode;
  target: string | SimNode;
}

const WIDTH = 720;
const HEIGHT = 420;

function radiusFor(downloads: number): number {
  const min = 10;
  const max = 26;
  const scaled = Math.log10(Math.max(downloads, 1000)) - 3;
  return Math.min(max, min + scaled * 3.2);
}

export function DependencyGraph({
  graph,
  focusName,
}: {
  graph: GraphResult;
  focusName?: string;
}) {
  const router = useRouter();

  // The force layout is a pure function of `graph` (no async step, no external
  // system to synchronize with), so it's computed directly rather than via an
  // effect + extra render pass.
  const { nodes, links } = useMemo(() => {
    const nodes: SimNode[] = graph.nodes.map((node) => ({
      id: node.name,
      downloads: node.downloads,
    }));
    const links: SimLink[] = graph.edges.map((edge) => ({
      source: edge.from,
      target: edge.to,
    }));

    forceSimulation(nodes)
      .force(
        "link",
        forceLink<SimNode, SimLink>(links)
          .id((d) => d.id)
          .distance(90)
          .strength(0.6),
      )
      .force("charge", forceManyBody().strength(-220))
      .force("center", forceCenter(WIDTH / 2, HEIGHT / 2))
      .force(
        "collide",
        forceCollide<SimNode>((d) => radiusFor(d.downloads) + 24),
      )
      .stop()
      .tick(200);

    return { nodes, links };
  }, [graph]);

  if (nodes.length === 0) {
    return null;
  }

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label="Dependency graph"
      className="h-auto w-full rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
    >
      <defs>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" className="fill-zinc-400 dark:fill-zinc-600" />
        </marker>
      </defs>
      <g>
        {links.map((link, i) => {
          const source = link.source as SimNode;
          const target = link.target as SimNode;
          if (typeof source !== "object" || typeof target !== "object") return null;

          const r = radiusFor(target.downloads);
          const dx = (target.x ?? 0) - (source.x ?? 0);
          const dy = (target.y ?? 0) - (source.y ?? 0);
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const tx = (target.x ?? 0) - (dx / dist) * (r + 4);
          const ty = (target.y ?? 0) - (dy / dist) * (r + 4);

          return (
            <line
              key={i}
              x1={source.x}
              y1={source.y}
              x2={tx}
              y2={ty}
              className="stroke-zinc-300 dark:stroke-zinc-700"
              strokeWidth={1.5}
              markerEnd="url(#arrow)"
            />
          );
        })}
      </g>
      <g>
        {nodes.map((node) => {
          const isFocus = node.id === focusName;
          const r = radiusFor(node.downloads);

          return (
            <g
              key={node.id}
              transform={`translate(${node.x ?? 0}, ${node.y ?? 0})`}
              className="cursor-pointer"
              onClick={() => router.push(`/packages/${encodeURIComponent(node.id)}`)}
            >
              <circle
                r={r}
                className={
                  isFocus
                    ? "fill-indigo-500 stroke-indigo-600"
                    : "fill-white stroke-indigo-300 dark:fill-zinc-800 dark:stroke-indigo-700"
                }
                strokeWidth={2}
              />
              <text
                y={r + 14}
                textAnchor="middle"
                className={
                  isFocus
                    ? "fill-zinc-900 text-[11px] font-semibold dark:fill-zinc-50"
                    : "fill-zinc-600 text-[11px] dark:fill-zinc-400"
                }
              >
                {node.id}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
