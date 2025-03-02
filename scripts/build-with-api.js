const { spawn, execSync } = require('child_process');
const process = require('process');

console.log('Starting development server...');
const devServer = spawn('npm', ['run', 'dev'], { 
  stdio: 'pipe',
  detached: true 
});

// Log the output from the dev server
devServer.stdout.on('data', (data) => {
  console.log(`Dev server: ${data}`);
});

// Wait for the server to start
console.log('Waiting for dev server to start...');
setTimeout(() => {
  try {
    console.log('Building the application...');
    execSync('npm run build', { stdio: 'inherit' });
    console.log('Build completed successfully.');
  } catch (error) {
    console.error('Build failed:', error);
  } finally {
    // Kill the dev server
    console.log('Shutting down dev server...');
    process.kill(-devServer.pid);
    console.log('Done!');
  }
}, 10000); // Wait 10 seconds for the dev server to start
