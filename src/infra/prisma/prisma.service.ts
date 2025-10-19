import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  public async onModuleInit() {
    this.logger.log('Initializating database connection...');

    try {
      await this.$connect();
      this.logger.log('Database connection established successfully.');
    } catch (err) {
      this.logger.error('Failed to established database connection: ', err);
      throw err;
    }
  }

  public async onModuleDestroy() {
    this.logger.log('Closing database connection...');

    try {
      await this.$disconnect();
      this.logger.log('Database connection closed successfully.');
    } catch (err) {
      this.logger.error('Error occured while closing the database connection: ', err);
      throw err;
    }
  }
}
