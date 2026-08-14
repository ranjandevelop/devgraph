import neo4j from "neo4j-driver";
import { env } from "../config/env";

export const driver = neo4j.driver(
  env.COGNODB_URI,
  neo4j.auth.basic(env.COGNODB_USERNAME, env.COGNODB_PASSWORD),
  {
    disableLosslessIntegers: true,
    // Fail fast instead of hanging for the driver's default 30s+ when
    // CognoDB is unreachable, so /health and other routes return 503 quickly.
    connectionTimeout: 5000,
  },
);

export async function closeDriver() {
  await driver.close();
}
