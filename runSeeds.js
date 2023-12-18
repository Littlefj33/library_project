import { booksAuthorsSeed } from "./seeds/booksAuthorsSeed.js";
import { seedData } from "./seeds/seedFunction.js";

try {
  await booksAuthorsSeed();
  await seedData();
  console.log("COMPLETE");
  process.exit(0);
} catch (e) {
  console.error(e);
  process.exit(1);
}
