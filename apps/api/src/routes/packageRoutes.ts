import { Router } from "express";
import * as packageController from "../controllers/packageController";
import { validateParams, validateQuery } from "../middleware/validate";
import {
  packageNameParamSchema,
  graphQuerySchema,
  listQuerySchema,
} from "../validators/packageValidators";

const router = Router();

router.get("/", validateQuery(listQuerySchema), packageController.listPackages);

router.get("/:name", validateParams(packageNameParamSchema), packageController.getPackage);

router.get(
  "/:name/dependencies",
  validateParams(packageNameParamSchema),
  packageController.getDependencies,
);

router.get(
  "/:name/dependents",
  validateParams(packageNameParamSchema),
  packageController.getDependents,
);

router.get(
  "/:name/shared-dependencies",
  validateParams(packageNameParamSchema),
  packageController.getSharedDependencies,
);

router.get(
  "/:name/graph",
  validateParams(packageNameParamSchema),
  validateQuery(graphQuerySchema),
  packageController.getGraph,
);

export default router;
