import { Router } from "express";
import * as graphController from "../controllers/graphController";
import { validateQuery } from "../middleware/validate";
import { pathQuerySchema } from "../validators/graphValidators";

const router = Router();

router.get("/path", validateQuery(pathQuerySchema), graphController.getPath);

export default router;
