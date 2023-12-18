import { booksAuthorsSeed } from "./seed/booksAuthorsSeed.js";
import { usersBlogsEventsSeed } from "./seed/seedFunction.js";

try {
  await booksAuthorsSeed();
  await usersBlogsEventsSeed();
  console.log("COMPLETE");
  process.exit(0);
} catch (e) {
  console.error(e);
  process.exit(1);
}
