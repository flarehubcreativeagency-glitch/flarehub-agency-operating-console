import { describe, expect, it } from 'vitest';
import { getProjectRoom } from './domain';

describe('Project Room domain aggregate', () => {
  it('connects project, client, tasks, chat, files, finance, and activity', () => {
    const room = getProjectRoom('p-web-redesign');
    expect(room?.project.name).toBe('Website Redesign Q2');
    expect(room?.client?.name).toContain('Demo');
    expect(room?.tasks.length).toBeGreaterThan(2);
    expect(room?.chats[0].visibility).toBe('internal');
    expect(room?.files.length).toBeGreaterThan(1);
    expect(room?.finance.length).toBeGreaterThan(1);
    expect(room?.activity.length).toBeGreaterThan(0);
  });
});
