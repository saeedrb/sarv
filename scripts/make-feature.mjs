import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const featureName = process.argv[2];

if (!featureName || !/^[a-z][a-z0-9-]*$/.test(featureName)) {
  console.error("Usage: npm run make:feature products");
  console.error("Feature name must be kebab-case.");
  process.exit(1);
}

const pascalName = featureName
  .split("-")
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join("");
const root = join(process.cwd(), "features", featureName);

if (existsSync(root)) {
  console.error(`Feature already exists: ${featureName}`);
  process.exit(1);
}

const files = {
  "api/.gitkeep": "",
  "components/.gitkeep": "",
  "hooks/.gitkeep": "",
  "types.ts": `export type ${pascalName} = {\n  id: string;\n};\n`,
  "schemas.ts": `import { z } from "zod";\n\nexport const ${featureName.replaceAll("-", "")}Schema = z.object({\n  id: z.string(),\n});\n`,
  "index.ts": `export * from "./schemas";\nexport * from "./types";\n`,
};

for (const path of Object.keys(files)) {
  mkdirSync(join(root, path, ".."), { recursive: true });
}

for (const [path, content] of Object.entries(files)) {
  writeFileSync(join(root, path), content);
}

console.log(`Created feature: features/${featureName}`);
