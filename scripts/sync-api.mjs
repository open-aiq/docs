import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

const source = process.argv[2];
if (!source) {
  console.error(
    "Usage: npm run sync:api -- <path-to-backend/docs/swagger.yaml>",
  );
  process.exit(2);
}

const destination = resolve("src/assets/openapi/swagger.yaml");
const problemSource = join(dirname(resolve(source)), "problems.json");
const problemDestination = resolve("src/assets/openapi/problems.json");
let contents;
try {
  contents = await readFile(resolve(source), "utf8");
} catch (error) {
  console.error(`Unable to read API specification: ${error.message}`);
  process.exit(1);
}

const normalized = `${contents.replace(/\r\n/g, "\n").trimEnd()}\n`;
if (
  !/^swagger:\s*["']?2\.0["']?\s*$/m.test(normalized) ||
  !/^paths:\s*$/m.test(normalized)
) {
  console.error("Expected a Swagger 2.0 document containing a paths object.");
  process.exit(1);
}

await writeFile(destination, normalized);
console.log(`Synchronized ${destination} from ${resolve(source)}`);

let problems;
try {
  problems = JSON.parse(await readFile(problemSource, "utf8"));
} catch (error) {
  console.error(`Unable to read problem catalog: ${error.message}`);
  process.exit(1);
}
if (
  !Array.isArray(problems) ||
  problems.some((item) => !item.slug || !item.type || !item.status)
) {
  console.error(
    "Expected a problem catalog containing slug, type, and status fields.",
  );
  process.exit(1);
}
await writeFile(problemDestination, `${JSON.stringify(problems, null, 2)}\n`);
console.log(`Synchronized ${problemDestination} from ${problemSource}`);
