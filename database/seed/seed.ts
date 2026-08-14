import "dotenv/config";
import neo4j from "neo4j-driver";

const uri = process.env.COGNODB_URI;
const username = process.env.COGNODB_USERNAME;
const password = process.env.COGNODB_PASSWORD;

if (!uri || !username || !password) {
  console.error("Missing COGNODB_URI, COGNODB_USERNAME or COGNODB_PASSWORD in the environment.");
  process.exit(1);
}

const driver = neo4j.driver(uri, neo4j.auth.basic(username, password));

const categories = [
  "framework",
  "state-management",
  "http-client",
  "utility",
  "testing",
  "build-tool",
  "backend",
  "cli",
  "linting",
  "css",
];

const organizations = [
  { name: "Nimbus Labs", website: "https://nimbuslabs.dev" },
  { name: "Vertex Software", website: "https://vertexsoftware.io" },
  { name: "OpenSource Collective", website: "https://oss-collective.org" },
  { name: "BrightPath Technologies", website: "https://brightpath.tech" },
  { name: "Ironclad Systems", website: "https://ironcladsystems.com" },
];

const developers = [
  { name: "Maya Chen", github: "mayachen-dev" },
  { name: "Jordan Lee", github: "jlee-oss" },
  { name: "Sam Patel", github: "sampatel" },
  { name: "Alex Rivera", github: "arivera" },
  { name: "Chris Okafor", github: "cokafor" },
  { name: "Taylor Kim", github: "taylork" },
  { name: "Morgan Diaz", github: "mdiaz" },
  { name: "Riley Zhang", github: "rzhang" },
  { name: "Casey Novak", github: "cnovak" },
  { name: "Jamie Fischer", github: "jfischer" },
];

const orgSlug: Record<string, string> = {
  "Nimbus Labs": "nimbus-labs",
  "Vertex Software": "vertex-software",
  "OpenSource Collective": "oss-collective",
  "BrightPath Technologies": "brightpath",
  "Ironclad Systems": "ironclad-systems",
};

interface PackageSeed {
  name: string;
  version: string;
  description: string;
  license: string;
  downloads: number;
  category: string;
  org: string;
  maintainers: string[];
  deps: string[];
}

function pkg(
  name: string,
  version: string,
  description: string,
  license: string,
  downloads: number,
  category: string,
  org: string,
  maintainers: string[],
  deps: string[] = [],
): PackageSeed {
  return { name, version, description, license, downloads, category, org, maintainers, deps };
}

const packages: PackageSeed[] = [
  pkg("react", "18.3.1", "A declarative library for building user interfaces", "MIT", 22000000, "framework", "Nimbus Labs", ["mayachen-dev", "jlee-oss"], ["loose-envify", "object-assign"]),
  pkg("react-dom", "18.3.1", "React package for working with the DOM", "MIT", 20500000, "framework", "Nimbus Labs", ["mayachen-dev"], ["react", "scheduler", "object-assign", "loose-envify"]),
  pkg("scheduler", "0.23.2", "Cooperative scheduler for the browser environment", "MIT", 21000000, "utility", "Nimbus Labs", ["jlee-oss"], ["loose-envify", "object-assign"]),
  pkg("loose-envify", "1.4.0", "Replace env variables in JS with actual values", "MIT", 38000000, "utility", "OpenSource Collective", ["sampatel"], ["js-tokens"]),
  pkg("js-tokens", "4.0.0", "Tiny JavaScript tokenizer", "MIT", 42000000, "utility", "OpenSource Collective", ["sampatel"]),
  pkg("object-assign", "4.1.1", "ES2015 Object.assign() ponyfill", "MIT", 40000000, "utility", "OpenSource Collective", ["arivera"]),
  pkg("prop-types", "15.8.1", "Runtime type checking for React props", "MIT", 19000000, "utility", "Nimbus Labs", ["mayachen-dev"], ["loose-envify", "object-assign", "react-is", "debug"]),
  pkg("react-is", "18.3.1", "Brand checking of React elements", "MIT", 18000000, "utility", "Nimbus Labs", ["jlee-oss"]),
  pkg("history", "5.3.0", "Manage session history in JavaScript", "MIT", 9000000, "utility", "Vertex Software", ["cokafor"]),
  pkg("react-router", "6.24.0", "Declarative routing for React applications", "MIT", 10500000, "framework", "Vertex Software", ["cokafor"], ["react", "history"]),
  pkg("react-router-dom", "6.24.0", "DOM bindings for React Router", "MIT", 10200000, "framework", "Vertex Software", ["cokafor", "taylork"], ["react-router", "react-dom", "history", "prop-types"]),
  pkg("redux", "5.0.1", "A predictable state container for JavaScript apps", "MIT", 7500000, "state-management", "Vertex Software", ["taylork"], ["debug"]),
  pkg("react-redux", "9.1.2", "Official React bindings for Redux", "MIT", 6800000, "state-management", "Vertex Software", ["taylork", "mayachen-dev"], ["react", "redux", "react-dom", "loose-envify", "prop-types"]),
  pkg("zustand", "4.5.4", "Small, fast state-management for React", "MIT", 4200000, "state-management", "BrightPath Technologies", ["mdiaz"], ["react"]),
  pkg("mobx", "6.13.0", "Simple, scalable state management", "MIT", 2200000, "state-management", "BrightPath Technologies", ["mdiaz"], ["debug"]),
  pkg("axios", "1.7.2", "Promise based HTTP client for the browser and node.js", "MIT", 45000000, "http-client", "OpenSource Collective", ["rzhang"], ["follow-redirects", "debug", "semver"]),
  pkg("follow-redirects", "1.15.6", "HTTP and HTTPS modules that follow redirects", "MIT", 40000000, "utility", "OpenSource Collective", ["rzhang"]),
  pkg("node-fetch", "3.3.2", "A light-weight module that brings fetch to Node.js", "MIT", 30000000, "http-client", "OpenSource Collective", ["cnovak"], ["debug"]),
  pkg("got", "14.4.1", "Human-friendly and powerful HTTP request library", "MIT", 8000000, "http-client", "OpenSource Collective", ["cnovak"], ["cacheable-request", "debug", "semver", "resolve"]),
  pkg("cacheable-request", "10.2.14", "Wrap native HTTP requests with RFC compliant cache support", "MIT", 6000000, "utility", "OpenSource Collective", ["cnovak"], ["debug"]),
  pkg("superagent", "9.0.2", "Small progressive client-side HTTP request library", "MIT", 4500000, "http-client", "OpenSource Collective", ["jfischer"], ["debug"]),
  pkg("supertest", "7.0.0", "HTTP assertions made easy via superagent", "MIT", 5200000, "testing", "OpenSource Collective", ["jfischer"], ["superagent", "debug"]),
  pkg("lodash", "4.17.21", "A modern JavaScript utility library delivering modularity and performance", "MIT", 48000000, "utility", "OpenSource Collective", ["sampatel"]),
  pkg("uuid", "10.0.0", "RFC-compliant UUID generator", "MIT", 35000000, "utility", "OpenSource Collective", ["arivera"]),
  pkg("date-fns", "3.6.0", "Modern JavaScript date utility library", "MIT", 20000000, "utility", "OpenSource Collective", ["arivera"]),
  pkg("chalk", "5.3.0", "Terminal string styling done right", "MIT", 180000000, "utility", "Ironclad Systems", ["cokafor"], ["ansi-styles", "supports-color"]),
  pkg("ansi-styles", "6.2.1", "ANSI escape codes for styling strings in the terminal", "MIT", 200000000, "utility", "Ironclad Systems", ["cokafor"]),
  pkg("supports-color", "9.4.0", "Detect whether a terminal supports color", "MIT", 150000000, "utility", "Ironclad Systems", ["cokafor"], ["has-flag"]),
  pkg("has-flag", "5.0.1", "Check if argv has a specific flag", "MIT", 160000000, "utility", "Ironclad Systems", ["cokafor"]),
  pkg("debug", "4.3.5", "Small debugging utility", "MIT", 90000000, "utility", "Ironclad Systems", ["taylork"], ["ms"]),
  pkg("ms", "2.1.3", "Convert time strings to milliseconds", "MIT", 95000000, "utility", "Ironclad Systems", ["taylork"]),
  pkg("semver", "7.6.2", "The semantic versioner for npm", "ISC", 85000000, "utility", "Ironclad Systems", ["mdiaz"]),
  pkg("glob", "10.4.2", "Match files using patterns", "ISC", 60000000, "utility", "Ironclad Systems", ["mdiaz"], ["minimatch"]),
  pkg("minimatch", "9.0.4", "A glob matcher in JavaScript", "ISC", 65000000, "utility", "Ironclad Systems", ["mdiaz"]),
  pkg("resolve", "1.22.8", "Resolve module paths according to the Node.js algorithm", "MIT", 55000000, "utility", "Ironclad Systems", ["rzhang"]),
  pkg("picocolors", "1.0.1", "Tiny ANSI color formatting library for terminals", "ISC", 70000000, "utility", "Ironclad Systems", ["rzhang"]),
  pkg("commander", "12.1.0", "The complete solution for Node.js command-line interfaces", "MIT", 55000000, "cli", "BrightPath Technologies", ["taylork"]),
  pkg("yargs", "17.7.2", "Command-line argument parser", "MIT", 48000000, "cli", "BrightPath Technologies", ["taylork"], ["yargs-parser", "ansi-styles", "chalk", "debug"]),
  pkg("yargs-parser", "21.1.1", "The mighty option parser used by yargs", "ISC", 50000000, "cli", "BrightPath Technologies", ["taylork"]),
  pkg("express", "4.19.2", "Fast, unopinionated, minimalist web framework for Node.js", "MIT", 30000000, "backend", "Vertex Software", ["mdiaz", "cokafor"], ["body-parser", "cors", "finalhandler", "debug", "semver"]),
  pkg("body-parser", "1.20.2", "Node.js body parsing middleware", "MIT", 28000000, "backend", "Vertex Software", ["cokafor"], ["debug"]),
  pkg("cors", "2.8.5", "Node.js CORS middleware", "MIT", 20000000, "backend", "Vertex Software", ["cokafor"], ["debug"]),
  pkg("finalhandler", "1.2.0", "Node.js final http responder", "MIT", 22000000, "backend", "Vertex Software", ["cokafor"], ["debug"]),
  pkg("helmet", "7.1.0", "Secure Express apps with various HTTP headers", "MIT", 3500000, "backend", "Vertex Software", ["rzhang"], ["debug"]),
  pkg("webpack", "5.92.1", "A bundler for JavaScript and friends", "MIT", 22000000, "build-tool", "BrightPath Technologies", ["rzhang", "mayachen-dev"], ["terser-webpack-plugin", "webpack-sources", "glob", "semver", "debug"]),
  pkg("webpack-cli", "5.1.4", "CLI for webpack", "MIT", 6000000, "build-tool", "BrightPath Technologies", ["mayachen-dev"], ["webpack", "commander", "yargs", "debug"]),
  pkg("terser-webpack-plugin", "5.3.10", "Terser plugin for webpack", "MIT", 15000000, "build-tool", "BrightPath Technologies", ["mayachen-dev"], ["terser", "semver", "debug"]),
  pkg("terser", "5.31.1", "JavaScript parser, mangler and compressor toolkit", "BSD-2-Clause", 18000000, "build-tool", "BrightPath Technologies", ["mayachen-dev"], ["commander", "semver"]),
  pkg("webpack-sources", "3.2.3", "Source code handling utilities for webpack", "MIT", 20000000, "build-tool", "BrightPath Technologies", ["jlee-oss"], ["debug"]),
  pkg("rollup", "4.18.0", "Module bundler for JavaScript", "MIT", 8000000, "build-tool", "BrightPath Technologies", ["jlee-oss"], ["picocolors"]),
  pkg("vite", "5.3.1", "Next generation frontend tooling", "MIT", 12000000, "build-tool", "BrightPath Technologies", ["jlee-oss", "sampatel"], ["esbuild", "rollup", "picocolors", "resolve", "debug"]),
  pkg("esbuild", "0.21.5", "An extremely fast JavaScript bundler and minifier", "MIT", 16000000, "build-tool", "BrightPath Technologies", ["sampatel"]),
  pkg("chokidar", "3.6.0", "Minimal and efficient cross-platform file watching library", "MIT", 40000000, "build-tool", "Ironclad Systems", ["rzhang"], ["glob", "debug", "minimatch"]),
  pkg("nodemon", "3.1.4", "Monitor for changes and automatically restart the server", "MIT", 4500000, "cli", "Ironclad Systems", ["rzhang"], ["chokidar", "debug", "semver"]),
  pkg("cross-env", "7.0.3", "Run scripts with environment variables set across platforms", "MIT", 9000000, "cli", "Ironclad Systems", ["jfischer"]),
  pkg("jest", "29.7.0", "Delightful JavaScript testing", "MIT", 20000000, "testing", "Nimbus Labs", ["sampatel"], ["jest-cli", "chalk", "glob"]),
  pkg("jest-cli", "29.7.0", "CLI for Jest", "MIT", 18000000, "testing", "Nimbus Labs", ["sampatel"], ["chalk", "yargs"]),
  pkg("vitest", "1.6.0", "A Vite-native testing framework", "MIT", 6000000, "testing", "Nimbus Labs", ["mdiaz"], ["esbuild", "vite", "debug", "chalk"]),
  pkg("eslint", "9.5.0", "Find and fix problems in your JavaScript code", "MIT", 32000000, "linting", "OpenSource Collective", ["taylork"], ["chalk", "debug", "glob", "minimatch", "semver", "resolve"]),
  pkg("prettier", "3.3.2", "An opinionated code formatter", "MIT", 30000000, "linting", "OpenSource Collective", ["taylork"]),
  pkg("vue", "3.4.30", "The progressive JavaScript framework", "MIT", 5000000, "framework", "BrightPath Technologies", ["cnovak"]),
  pkg("classnames", "2.5.1", "A simple utility for conditionally joining classNames together", "MIT", 25000000, "css", "OpenSource Collective", ["jfischer"]),
  pkg("postcss", "8.4.38", "A tool for transforming CSS with JavaScript plugins", "MIT", 45000000, "css", "OpenSource Collective", ["jfischer"], ["picocolors", "resolve"]),
];

async function run() {
  const session = driver.session();

  try {
    console.log("Verifying CognoDB connectivity...");
    await driver.verifyConnectivity();

    console.log("Creating uniqueness constraints...");
    const constraints = [
      "CREATE CONSTRAINT package_name IF NOT EXISTS FOR (p:Package) REQUIRE p.name IS UNIQUE",
      "CREATE CONSTRAINT developer_github IF NOT EXISTS FOR (d:Developer) REQUIRE d.github IS UNIQUE",
      "CREATE CONSTRAINT organization_name IF NOT EXISTS FOR (o:Organization) REQUIRE o.name IS UNIQUE",
      "CREATE CONSTRAINT category_name IF NOT EXISTS FOR (c:Category) REQUIRE c.name IS UNIQUE",
    ];
    for (const constraint of constraints) {
      try {
        await session.run(constraint);
      } catch (error) {
        console.warn(`Skipping constraint (not supported or already exists): ${(error as Error).message}`);
      }
    }

    console.log("Seeding categories...");
    await session.run(
      `UNWIND $categories AS name
       MERGE (c:Category {name: name})`,
      { categories },
    );

    console.log("Seeding organizations...");
    await session.run(
      `UNWIND $organizations AS org
       MERGE (o:Organization {name: org.name})
       SET o.website = org.website`,
      { organizations },
    );

    console.log("Seeding developers...");
    await session.run(
      `UNWIND $developers AS dev
       MERGE (d:Developer {github: dev.github})
       SET d.name = dev.name`,
      { developers },
    );

    console.log("Seeding packages...");
    const packageRows = packages.map((p) => ({
      name: p.name,
      version: p.version,
      description: p.description,
      license: p.license,
      downloads: p.downloads,
      repository: `https://github.com/${orgSlug[p.org]}/${p.name}`,
    }));
    await session.run(
      `UNWIND $packages AS pkg
       MERGE (p:Package {name: pkg.name})
       SET p.version = pkg.version,
           p.description = pkg.description,
           p.license = pkg.license,
           p.downloads = pkg.downloads,
           p.repository = pkg.repository`,
      { packages: packageRows },
    );

    console.log("Linking packages to categories...");
    await session.run(
      `UNWIND $packages AS pkg
       MATCH (p:Package {name: pkg.name})
       MATCH (c:Category {name: pkg.category})
       MERGE (p)-[:BELONGS_TO]->(c)`,
      { packages: packages.map((p) => ({ name: p.name, category: p.category })) },
    );

    console.log("Linking packages to organizations...");
    await session.run(
      `UNWIND $packages AS pkg
       MATCH (p:Package {name: pkg.name})
       MATCH (o:Organization {name: pkg.org})
       MERGE (p)-[:PUBLISHED_BY]->(o)`,
      { packages: packages.map((p) => ({ name: p.name, org: p.org })) },
    );

    console.log("Linking packages to maintainers...");
    const maintainerRows = packages.flatMap((p) =>
      p.maintainers.map((github) => ({ name: p.name, github })),
    );
    await session.run(
      `UNWIND $rows AS row
       MATCH (p:Package {name: row.name})
       MATCH (d:Developer {github: row.github})
       MERGE (p)-[:MAINTAINED_BY]->(d)`,
      { rows: maintainerRows },
    );

    console.log("Linking dependency relationships...");
    const dependencyRows = packages.flatMap((p) =>
      p.deps.map((dep) => ({ name: p.name, dep })),
    );
    await session.run(
      `UNWIND $rows AS row
       MATCH (p:Package {name: row.name})
       MATCH (d:Package {name: row.dep})
       MERGE (p)-[:DEPENDS_ON]->(d)`,
      { rows: dependencyRows },
    );

    const counts = await session.run(
      `MATCH (p:Package) WITH count(p) AS packages
       MATCH (d:Developer) WITH packages, count(d) AS developers
       MATCH (o:Organization) WITH packages, developers, count(o) AS organizations
       MATCH (c:Category) WITH packages, developers, organizations, count(c) AS categories
       MATCH ()-[r:DEPENDS_ON]->() WITH packages, developers, organizations, categories, count(r) AS dependsOn
       RETURN packages, developers, organizations, categories, dependsOn`,
    );

    const summary = counts.records[0]?.toObject();
    console.log("Seed complete:", summary);
  } finally {
    await session.close();
    await driver.close();
  }
}

run().catch((error) => {
  console.error("Seed failed:", error);
  process.exitCode = 1;
});
