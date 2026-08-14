import { z } from "zod";

export const packageName = z
  .string()
  .min(1)
  .max(214)
  .regex(/^[a-z0-9][a-z0-9._-]*$/, "Invalid package name");

export const packageNameParamSchema = z.object({
  name: packageName,
});

export const listQuerySchema = z.object({
  search: z.string().min(1).max(214).optional(),
});

export const graphQuerySchema = z
  .object({
    depth: z.enum(["1", "2", "3"]).default("2"),
  })
  .transform((data) => ({ depth: Number(data.depth) as 1 | 2 | 3 }));
