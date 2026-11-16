/**
 * A flag that stays set for the rest of the browser session. It lives in
 * sessionStorage, with an in-memory backup for browsers where storage throws
 * (private modes, blocked storage), which then covers the current page only.
 */
export function sessionFlag(key: string) {
  let inMemory = false;
  return {
    has(): boolean {
      try {
        return inMemory || window.sessionStorage.getItem(key) === '1';
      } catch {
        return inMemory;
      }
    },
    mark(): void {
      inMemory = true;
      try {
        window.sessionStorage.setItem(key, '1');
      } catch {
        // Storage is optional; the in-memory flag covers this page.
      }
    },
  };
}
