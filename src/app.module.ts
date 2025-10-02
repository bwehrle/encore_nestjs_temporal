import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
import { WorkerOnlyModule } from './worker/worker.module';

@Module({
  imports: [
    CatsModule,
    WorkerOnlyModule,
  ],
  exports: [],
})
export class AppModule {}
