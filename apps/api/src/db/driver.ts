import neo4j from "neo4j-driver";
import { env } from "../config/env";

export const driver = neo4j.driver(
  env.COGNODB_URI,
  neo4j.auth.basic(env.COGNODB_USERNAME, env.COGNODB_PASSWORD),
  { disableLosslessIntegers: true },
);

export async function closeDriver() {
  await driver.close();
}
