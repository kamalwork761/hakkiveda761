// Password hashing utility using standard Web Crypto API (SHA-256)

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const DEFAULT_ADMIN_EMAIL = 'hakkiveda@gmail.com';
export const DEFAULT_ADMIN_PASSWORD_PLAIN = 'Kamal@2026';
