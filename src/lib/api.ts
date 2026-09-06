import { createClient } from '@metagptx/web-sdk';

export const client = createClient();

export function getSchoolId(): number | null {
  const stored = localStorage.getItem('current_school_id');
  return stored ? parseInt(stored, 10) : null;
}

export function setSchoolId(id: number) {
  localStorage.setItem('current_school_id', String(id));
}

export function getUserRole(): string | null {
  return localStorage.getItem('user_role');
}

export function setUserRole(role: string) {
  localStorage.setItem('user_role', role);
}
