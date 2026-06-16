import { PrismaClient } from "@prisma/client";
import { env } from "./env";

const prisma = new PrismaClient({
  log: env.isDev ? ["error", "warn"] : ["error"],
});

export default prisma;
