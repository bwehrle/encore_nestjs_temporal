import { Module } from '@nestjs/common';
import { CatsService } from './cats.service';
import { catsProviders } from './cats.providers';
import { DatabaseModule } from '../core/database.module';
import { TemporalClientModule, TemporalClientService } from 'nestjs-temporal-core';

@Module({
  imports: [DatabaseModule,
    TemporalClientModule.forClient({
      connection: {
        address: 'localhost:7233',
        namespace: 'default'
      }
    })
  ],
  providers: [CatsService, ...catsProviders],
})
export class CatsModule {}
