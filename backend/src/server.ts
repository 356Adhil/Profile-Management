import dotenv from "dotenv";
dotenv.config();

import { createApp } from "./app";
import { connectDB } from "./config/db";

const PORT = Number(process.env.PORT || 4000);
const MONGODB_URI = String(process.env.MONGODB_URI);

async function bootstrap() {
  await connectDB(MONGODB_URI);
  const app = createApp();
  app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
}

bootstrap().catch((e) => {
  console.error(e);
  process.exit(1);
});