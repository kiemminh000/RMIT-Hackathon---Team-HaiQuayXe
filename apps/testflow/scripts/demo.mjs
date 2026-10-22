import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const child = spawn(process.execPath, [require.resolve('next/dist/bin/next'), 'dev', '-H', '127.0.0.1', '-p', '3030', ...process.argv.slice(2)], {
  stdio: 'inherit', env: { ...process.env, TESTFLOW_DEMO_MODE: '1' }
});
child.on('exit', (code) => { process.exitCode = code ?? 1; });
