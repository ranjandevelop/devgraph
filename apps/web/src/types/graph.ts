export interface Package {
  name: string;
  version: string;
  description: string;
  license: string;
  downloads: number;
  repository: string;
}

export interface GraphEdge {
  from: string;
  to: string;
}

export interface GraphResult {
  nodes: Package[];
  edges: GraphEdge[];
}

export interface PathResult extends GraphResult {
  hops: number;
}

export interface SharedDependencyResult {
  package: Package;
  sharedDependencies: string[];
}
