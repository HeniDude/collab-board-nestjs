import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from 'src/api/api.module';

import { InfraModule } from 'src/infra/infra.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    InfraModule,
    ApiModule,
  ],
})
export class AppModule {}
