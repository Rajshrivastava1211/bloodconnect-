const { spawn } = require('child_process');
const path = require('path');

console.log('--- Starting BloodConnect v2 Development Environment ---');

// Define directories
const backendDir = path.join(__dirname, 'server');
const frontendDir = path.join(__dirname, 'client');

// Spawn Backend Process
const backendProcess = spawn('node', ['src/server.js'], {
  cwd: backendDir,
  shell: true,
  stdio: 'pipe'
});

// Spawn Frontend Process
const frontendProcess = spawn('npm.cmd', ['run', 'dev'], {
  cwd: frontendDir,
  shell: true,
  stdio: 'pipe'
});

// Helper to log output with colored prefix
function setupLogging(process, prefix, colorCode) {
  process.stdout.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        console.log(`\x1b[${colorCode}m[${prefix}]\x1b[0m ${line}`);
      }
    });
  });

  process.stderr.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        console.error(`\x1b[31m[${prefix} Error]\x1b[0m ${line}`);
      }
    });
  });
}

// Log color codes: 36 = cyan (backend), 32 = green (frontend)
setupLogging(backendProcess, 'Backend', '36');
setupLogging(frontendProcess, 'Frontend', '32');

// Handle shutdown
function killAll() {
  console.log('\n--- Shutting down development processes ---');
  try {
    backendProcess.kill();
  } catch (e) {}
  try {
    frontendProcess.kill();
  } catch (e) {}
  process.exit();
}

process.on('SIGINT', killAll);
process.on('SIGTERM', killAll);

backendProcess.on('exit', (code) => {
  console.log(`Backend process exited with code ${code}`);
  killAll();
});

frontendProcess.on('exit', (code) => {
  console.log(`Frontend process exited with code ${code}`);
  killAll();
});
