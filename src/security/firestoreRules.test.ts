import { describe, expect, it } from 'vitest';
import { firestoreRulesModel } from './access';

describe('Firestore rule model', () => {
  it('fails closed and contains no broad public allow rule', () => {
    expect(firestoreRulesModel).toContain('allow read, write: if false');
    expect(firestoreRulesModel).not.toMatch(/allow\s+read,\s*write:\s*if\s+true/);
    expect(firestoreRulesModel).not.toMatch(/request\.auth\s*==\s*null/);
  });

  it('models finance, membership, and immutable audit protections', () => {
    expect(firestoreRulesModel).toContain('financeAllowed');
    expect(firestoreRulesModel).toContain('projectMember(projectId)');
    expect(firestoreRulesModel).toContain('allow update, delete: if false');
  });
});
