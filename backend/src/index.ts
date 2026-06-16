import app from "./app";
import { env } from "./config/env";
import prisma from "./config/database";

async function bootstrap(): Promise<void> {
  try {
    await prisma.$connect();
    console.log("✓ Database connected");

    const server = app.listen(env.port, () => {
      console.log(`✓ Server running on http://localhost:${env.port}`);
      console.log(`  Environment: ${env.nodeEnv}`);
      console.log(`  Frontend origin: ${env.frontendUrl}`);
    });

    const shutdown = async (signal: string): Promise<void> => {
      console.log(`\n${signal} received — shutting down gracefully`);
      server.close(async () => {
        await prisma.$disconnect();
        console.log("Database disconnected. Process exiting.");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (err) {
    console.error("Failed to start server:", err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

bootstrap();
