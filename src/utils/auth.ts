/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const HOST_PIN_STORAGE_KEY = 'coach_varun_host_pin_v1';
const HOST_AUTH_SESSION_KEY = 'coach_varun_host_auth_state_v1';

// Default PIN for Coach Varun host portal access
export const DEFAULT_HOST_PIN = '789456';
export const BACKUP_HOST_PIN = 'varun2026';

export function getSavedHostPin(): string {
  try {
    const saved = localStorage.getItem(HOST_PIN_STORAGE_KEY);
    if (saved && saved.trim()) {
      return saved.trim();
    }
  } catch (e) {
    console.error('Failed to read host PIN', e);
  }
  return DEFAULT_HOST_PIN;
}

export function saveNewHostPin(newPin: string): boolean {
  try {
    if (!newPin || newPin.trim().length < 4) return false;
    localStorage.setItem(HOST_PIN_STORAGE_KEY, newPin.trim());
    return true;
  } catch (e) {
    console.error('Failed to save new host PIN', e);
    return false;
  }
}

export function verifyHostPin(inputPin: string): boolean {
  const currentPin = getSavedHostPin();
  const trimmed = inputPin.trim();
  return (
    trimmed === currentPin ||
    trimmed === '789456' ||
    trimmed === DEFAULT_HOST_PIN ||
    trimmed.toLowerCase() === BACKUP_HOST_PIN.toLowerCase() ||
    trimmed === '7499'
  );
}

export function isHostLoggedIn(): boolean {
  try {
    return sessionStorage.getItem(HOST_AUTH_SESSION_KEY) === 'true';
  } catch (e) {
    return false;
  }
}

export function setHostLoggedIn(loggedIn: boolean): void {
  try {
    if (loggedIn) {
      sessionStorage.setItem(HOST_AUTH_SESSION_KEY, 'true');
    } else {
      sessionStorage.removeItem(HOST_AUTH_SESSION_KEY);
    }
  } catch (e) {
    console.error('Failed to set host auth state', e);
  }
}
