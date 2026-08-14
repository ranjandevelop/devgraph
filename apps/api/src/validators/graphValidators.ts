import { z } from "zod";
import { packageName } from "./packageValidators";

export const pathQuerySchema = z.object({
  from: packageName,
  to: packageName,
});
