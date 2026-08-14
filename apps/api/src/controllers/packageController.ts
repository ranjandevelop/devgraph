import type { RequestHandler } from "express";
import * as packageService from "../services/packageService";
import * as graphService from "../services/graphService";

export const listPackages: RequestHandler = async (_req, res) => {
  const { search } = res.locals.query as { search?: string };
  const data = await packageService.listPackages(search);
  res.json({ data });
};

export const getPackage: RequestHandler = async (_req, res) => {
  const { name } = res.locals.params as { name: string };
  const data = await packageService.getPackageByName(name);
  res.json({ data });
};

export const getDependencies: RequestHandler = async (_req, res) => {
  const { name } = res.locals.params as { name: string };
  const data = await packageService.getDependencies(name);
  res.json({ data });
};

export const getDependents: RequestHandler = async (_req, res) => {
  const { name } = res.locals.params as { name: string };
  const data = await packageService.getDependents(name);
  res.json({ data });
};

export const getSharedDependencies: RequestHandler = async (_req, res) => {
  const { name } = res.locals.params as { name: string };
  const data = await packageService.getSharedDependencies(name);
  res.json({ data });
};

export const getGraph: RequestHandler = async (_req, res) => {
  const { name } = res.locals.params as { name: string };
  const { depth } = res.locals.query as { depth: 1 | 2 | 3 };
  const data = await graphService.getDependencyGraph(name, depth);
  res.json({ data });
};
