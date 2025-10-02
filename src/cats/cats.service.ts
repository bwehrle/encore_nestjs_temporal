import { Inject, Injectable } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';
import { CreateCatDto } from './dto/create-cat.dto';
import { Knex } from 'knex';
import { TemporalClientService } from 'nestjs-temporal-core';

@Injectable()
export class CatsService {
  constructor(
    @Inject('CAT_MODEL') private readonly db: () => Knex.QueryBuilder<Cat>,
    @Inject(TemporalClientService) private readonly temporalClientService: TemporalClientService,
  ) {}

  async create(createCatDto: CreateCatDto): Promise<void> {
    await this.db().insert(createCatDto, '*');
    const notificationData = {
      to: "bar@foo.com",
      subject: `New cat created: ${createCatDto.name}`,
      body: "A new cat has been created: "+JSON.stringify(createCatDto, null, 2)
    };
    await this.temporalClientService.startWorkflow('processEmailWorkflow', 
      ["foo@bar.com", notificationData],
      {
        taskQueue: 'main-queue',
        workflowId: 'email-workflow-'+Date.now()
      });
    return;
  }

  async get(id: number): Promise<Cat> {
    return this.db().where('id', id).first();
  }

  async findAll(): Promise<Cat[]> {
    return await this.db().select();
  }
}
