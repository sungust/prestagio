/** Validates editorial content and Planner data. Run: npm run content:check */
import { contentErrors } from "../src/lib/content/validate";

const errors = contentErrors();
if (errors.length) {
  for (const e of errors) console.error(`✗ ${e}`);
  process.exit(1);
}
console.log("✓ Content and Planner data are consistent.");
