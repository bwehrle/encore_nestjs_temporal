import { bundleWorkflowCode } from '@temporalio/worker';
import { writeFileSync, watch } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function bundleWorkflows() {
  try {
    console.log('Bundling workflows using Temporal\'s bundleWorkflowCode...');
    
    // Use Temporal's built-in bundling
    const { code } = await bundleWorkflowCode({
      workflowsPath: join(__dirname, '../src/workflows/workflows.ts')
    });
    
    // Ensure the output directory exists
    const outputDir = join(__dirname, '../dist/bundles');
    const outputPath = join(outputDir, 'workflows-temporal.bundle.js');
    
    // Write the bundled code to file
    writeFileSync(outputPath, code, 'utf8');
    
    console.log(`✅ Workflow bundle created: ${outputPath}`);
    console.log(`📦 Bundle size: ${(code.length / 1024).toFixed(2)} KB`);
    
    return { code };
  } catch (error) {
    console.error('❌ Failed to bundle workflows:', error);
    throw error;
  }
}

// Run the bundling if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  
  if (command === 'watch') {
    // Initial build
    bundleWorkflows()
      .then(() => {
        console.log('🎉 Initial build completed!');
        // Start watching
        watchWorkflows();
      })
      .catch((error) => {
        console.error('💥 Initial build failed:', error);
        process.exit(1);
      });
  } else {
    // One-time build
    bundleWorkflows()
      .then(() => {
        console.log('🎉 Workflow bundling completed successfully!');
        process.exit(0);
      })
      .catch((error) => {
        console.error('💥 Workflow bundling failed:', error);
        process.exit(1);
      });
  }
}

function watchWorkflows() {
  const workflowsPath = join(__dirname, '../src/workflows');
  console.log(`👀 Watching for changes in: ${workflowsPath}`);
  
  let isBuilding = false;
  
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
  
  const rebuild = debounce(async () => {
    if (isBuilding) return;
    isBuilding = true;
    
    console.log('🔄 Workflow files changed, rebuilding...');
    try {
      await bundleWorkflows();
      console.log('✅ Rebuild completed');
    } catch (error) {
      console.error('❌ Rebuild failed:', error);
    } finally {
      isBuilding = false;
    }
  }, 500);
  
  watch(workflowsPath, { recursive: true }, (eventType, filename) => {
    if (filename && (filename.endsWith('.ts') || filename.endsWith('.js'))) {
      console.log(`📝 Detected change: ${filename}`);
      rebuild();
    }
  });
  
  console.log('🚀 Watch mode started. Press Ctrl+C to stop.');
}

export { bundleWorkflows, watchWorkflows };
