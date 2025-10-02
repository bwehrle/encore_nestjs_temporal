import { Injectable } from '@nestjs/common';
import { Activity, ActivityMethod } from 'nestjs-temporal-core';

@Activity()
@Injectable()
export class EmailActivities {
  
  @ActivityMethod({name: 'sendEmail', timeout: '30s', maxRetries: 3})
  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    console.log(`Sending notification email to ${to}: ${subject}`);
    console.log(`Body: ${body}`);
    // Todo: Implement email sending logic here
  }

}