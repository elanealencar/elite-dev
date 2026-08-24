import "dotenv/config";
import { app } from "./app.js";

// Entry point used for local development.
const PORT = 3333;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});