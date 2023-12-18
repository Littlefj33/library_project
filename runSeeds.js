import { booksAuthorsSeed } from "./booksAuthorsSeed.js";
import { seedData } from "./seedFunction.js";

try {
  await booksAuthorsSeed();
  await seedData();
  console.log("COMPLETE");
  process.exit(0);
} catch (e) {
  console.error(e);
  process.exit(1);
}
