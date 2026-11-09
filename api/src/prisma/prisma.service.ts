
import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    });

    super({ adapter });
  }

  // Automatically connect when the NestJS module initializes
  async onModuleInit(): Promise<void> {
    await this.$connect();
    console.log("Prisma connected to the database successfully.");
  }

  // Disconnect when the application shuts down
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
