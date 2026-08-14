import { describe, it, expect, afterAll } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { closeDriver } from "../src/db/driver";

afterAll(async () => {
  await closeDriver();
});

describe("GET /health", () => {
  it("reports the database as connected", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok", database: "connected" });
  });
});

describe("GET /api/packages", () => {
  it("returns a default list of packages when no search is given", async () => {
    const res = await request(app).get("/api/packages");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("filters packages by search term", async () => {
    const res = await request(app).get("/api/packages?search=react");

    expect(res.status).toBe(200);
    const names = res.body.data.map((p: { name: string }) => p.name);
    expect(names.every((n: string) => n.includes("react"))).toBe(true);
  });
});

describe("GET /api/packages/:name", () => {
  it("returns package details for an existing package", async () => {
    const res = await request(app).get("/api/packages/react");

    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({ name: "react", license: "MIT" });
  });

  it("returns 404 for a package that does not exist", async () => {
    const res = await request(app).get("/api/packages/not-a-real-package");

    expect(res.status).toBe(404);
    expect(res.body.error.message).toMatch(/not found/i);
  });

  it("returns 400 for an invalid package name", async () => {
    const res = await request(app).get("/api/packages/Not_Valid!!");

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBeDefined();
  });
});

describe("GET /api/packages/:name/dependencies", () => {
  it("returns the direct dependencies of a package", async () => {
    const res = await request(app).get("/api/packages/react-dom/dependencies");

    expect(res.status).toBe(200);
    const names = res.body.data.map((p: { name: string }) => p.name);
    expect(names).toContain("react");
    expect(names).toContain("scheduler");
  });

  it("returns 404 when the package does not exist", async () => {
    const res = await request(app).get("/api/packages/not-a-real-package/dependencies");

    expect(res.status).toBe(404);
  });
});

describe("GET /api/packages/:name/dependents", () => {
  it("returns the packages that depend on the requested package", async () => {
    const res = await request(app).get("/api/packages/loose-envify/dependents");

    expect(res.status).toBe(200);
    const names = res.body.data.map((p: { name: string }) => p.name);
    expect(names).toContain("react");
  });
});

describe("GET /api/packages/:name/graph", () => {
  it("returns a multi-hop dependency graph", async () => {
    const res = await request(app).get("/api/packages/react-dom/graph?depth=2");

    expect(res.status).toBe(200);
    expect(res.body.data.nodes.length).toBeGreaterThan(1);
    expect(res.body.data.edges.length).toBeGreaterThan(0);
  });

  it("defaults depth to 2 when not provided", async () => {
    const res = await request(app).get("/api/packages/react-dom/graph");

    expect(res.status).toBe(200);
  });

  it("rejects an out-of-range depth", async () => {
    const res = await request(app).get("/api/packages/react-dom/graph?depth=9");

    expect(res.status).toBe(400);
  });

  it("rejects a non-numeric depth", async () => {
    const res = await request(app).get("/api/packages/react-dom/graph?depth=abc");

    expect(res.status).toBe(400);
  });
});

describe("GET /api/graph/path", () => {
  it("finds a connection between two packages", async () => {
    const res = await request(app).get("/api/graph/path?from=react&to=scheduler");

    expect(res.status).toBe(200);
    expect(res.body.data.nodes[0].name).toBe("react");
    expect(res.body.data.nodes.at(-1).name).toBe("scheduler");
  });

  it("returns 400 when 'from' is missing", async () => {
    const res = await request(app).get("/api/graph/path?to=scheduler");

    expect(res.status).toBe(400);
  });

  it("returns 404 when either package does not exist", async () => {
    const res = await request(app).get("/api/graph/path?from=react&to=not-a-real-package");

    expect(res.status).toBe(404);
  });
});

describe("GET /api/packages/:name/shared-dependencies", () => {
  it("returns packages that share a dependency", async () => {
    const res = await request(app).get("/api/packages/axios/shared-dependencies");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0]).toHaveProperty("sharedDependencies");
  });
});

describe("unmatched routes", () => {
  it("returns a safe 404 JSON body", async () => {
    const res = await request(app).get("/api/nonsense");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: { message: "Not found" } });
  });
});
