import { app } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";

const start = async (): Promise<void> => {
  await connectDatabase();

  app.listen(env.PORT, () => {
    console.log(`Backend running on http://localhost:${env.PORT}`);
  });
};

start().catch((error) => {
  console.error("Failed to start backend", error);
  process.exit(1);
});
