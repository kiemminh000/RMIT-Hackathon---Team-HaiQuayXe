import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { initialState, type WorkspaceState, type Member } from './domain';

const filename = path.join(process.cwd(), '.testflow', 'state.json');
// One Node process only. Share the write queue across Next's route bundles.
const runtime = globalThis as typeof globalThis & { testflowWriteQueue?: Promise<unknown> };

async function load(): Promise<WorkspaceState> {
  try { return JSON.parse(await fs.readFile(filename, 'utf8')) as WorkspaceState; }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return initialState();
    throw error;
  }
}
export async function readState(): Promise<WorkspaceState> {
  await runtime.testflowWriteQueue;
  return load();
}
export async function changeState<T>(change: (state: WorkspaceState) => T): Promise<T> {
  const operation = (runtime.testflowWriteQueue || Promise.resolve()).then(async () => {
    const state = await load();
    const result = change(state);
    const target = filename;
    await fs.mkdir(path.dirname(target), { recursive: true });
    const temporary = `${target}.${randomUUID()}.tmp`;
    await fs.writeFile(temporary, JSON.stringify(state, null, 2), 'utf8');
    await fs.rename(temporary, target);
    return result;
  });
  runtime.testflowWriteQueue = operation.catch(() => undefined);
  return operation;
}
export function activity(state: WorkspaceState, member: Member, action: string, target: string) {
  state.activity.unshift({ id: randomUUID(), actor: member.name, action, target, at: new Date().toISOString() });
  state.activity = state.activity.slice(0, 100);
}
