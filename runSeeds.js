import { booksAuthorsSeed } from "./seed/booksAuthorsSeed.js";

try {
  await booksAuthorsSeed();
  console.log("COMPLETE");
} catch (e) {
  console.log(e);
}
