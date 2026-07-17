import { describe, expect, it } from 'vitest';
import { financeRecords, files, users } from '../domain/demoData';
import { canAccessRoute, canReadFileContract, canReadFinance, canReadProject, canReadThread, canWriteProject, isAuthenticated } from './access';

const owner = users.find((user) => user.role === 'Owner');
const member = users.find((user) => user.role === 'Member') ?? users.find((user) => user.role === 'Project Manager');
const viewer = users.find((user) => user.role === 'Viewer');
const client = users.find((user) => user.role === 'Client');

describe('fail-closed runtime access', () => {
  it('rejects anonymous and disabled client portal identities', () => {
    expect(isAuthenticated(undefined)).toBe(false);
    expect(isAuthenticated(client)).toBe(false);
    expect(canAccessRoute(client, 'dashboard')).toBe(false);
  });

  it('scopes project reads and writes by membership and role', () => {
    expect(canReadProject(owner, 'p-web-redesign')).toBe(true);
    expect(canWriteProject(owner, 'p-web-redesign')).toBe(true);
    expect(canReadProject(viewer, 'p-web-redesign')).toBe(true);
    expect(canWriteProject(viewer, 'p-web-redesign')).toBe(false);
    expect(canWriteProject(member, 'p-web-redesign')).toBe(true);
  });

  it('guards finance records from non-finance roles', () => {
    const record = financeRecords[0];
    expect(canReadFinance(owner, record)).toBe(true);
    expect(canReadFinance(viewer, record)).toBe(false);
  });

  it('guards files, contracts, and internal chat boundaries', () => {
    const contract = files.find((item) => item.type === 'contract');
    expect(contract).toBeDefined();
    expect(canReadFileContract(owner, contract!)).toBe(true);
    expect(canReadFileContract(viewer, contract!)).toBe(false);
    expect(canReadThread(owner, 'internal', ['u-owner'])).toBe(true);
    expect(canReadThread(owner, 'client-visible', ['u-owner'])).toBe(false);
  });
});
