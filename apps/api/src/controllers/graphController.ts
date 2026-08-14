import type { RequestHandler } from "express";
import * as graphService from "../services/graphService";

export const getPath: RequestHandler = async (_req, res) => {
  const { from, to } = res.locals.query as { from: string; to: string };
  const data = await graphService.findPath(from, to);
  res.json({ data });
};
