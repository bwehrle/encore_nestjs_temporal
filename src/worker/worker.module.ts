import { Module } from '@nestjs/common';
import { TemporalWorkerModule } from 'nestjs-temporal-core';
import { EmailActivities } from '../activities/activities';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Loads a webpack bundle and returns it as a Temporal WorkflowBundle
 * This works around the limitation that bundled code can't require new modules
 */
function loadWorkflowBundle(): { code: string } {
  try {
    // Read the Temporal-bundled file
    const bundlePath = join(process.cwd(), 'dist/bundles/workflows-temporal.bundle.js');
    const bundleCode = readFileSync(bundlePath, 'utf8');
    
    // Return in the format expected by Temporal
    return { code: bundleCode };
  } catch (error) {
    console.error('Failed to load workflow bundle:', error);
    throw error;
  }
}

@Module({
  imports: [
    TemporalWorkerModule.forWorker({
      connection: {
        address: 'localhost:7233',
        namespace: 'default'
      },
      taskQueue: 'main-queue',
      workflowBundle: loadWorkflowBundle(),
      activityClasses: [EmailActivities]
    })
  ],
  providers: [EmailActivities],
})

export class WorkerOnlyModule {}
