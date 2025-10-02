// workflows/email.workflow.ts
import { proxyActivities } from '@temporalio/workflow';
import type { EmailActivities } from '../activities/activities';

const { sendEmail } = proxyActivities<EmailActivities>({
  startToCloseTimeout: '1 minute',
});

export async function processEmailWorkflow(
  userId: string,
  emailData: { to: string; subject: string; body: string }
): Promise<void> {
  // Send email 
  await sendEmail(emailData.to, emailData.subject, emailData.body);
  
}