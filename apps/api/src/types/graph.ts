export interface Package {
  name: string;
  version: string;
  description: string;
  license: string;
  downloads: number;
  repository: string;
}

export interface Developer {
  name: string;
  github: string;
}

export interface Organization {
  name: string;
  website: string;
}

export interface Category {
  name: string;
}

export interface GraphEdge {
  from: string;
  to: string;
}

export interface GraphResult {
  nodes: Package[];
  edges: GraphEdge[];
}
