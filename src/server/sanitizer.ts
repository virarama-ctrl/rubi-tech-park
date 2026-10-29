/**
 * Input sanitization and honeypot validation
 */

export function sanitizeText(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Strip angle brackets to prevent HTML/XSS injection
    .slice(0, 5000); // Guard against excessively large inputs
}

export function sanitizeEmail(email: unknown): string {
  if (typeof email !== 'string') return '';
  return email.trim().toLowerCase().slice(0, 255);
}

export function sanitizePhone(phone: unknown): string {
  if (typeof phone !== 'string') return '';
  return phone.trim().replace(/[^\d+]/g, '').slice(0, 20);
}

export function isHoneypotTriggered(body: Record<string, unknown>): boolean {
  // If hidden honeypot fields like website_url, hp_field, or company_url are filled, it is automated spam
  const honeypotKeys = ['website_trap', 'company_url', 'extra_details_hidden'];
  for (const key of honeypotKeys) {
    if (body[key] && typeof body[key] === 'string' && (body[key] as string).trim() !== '') {
      return true;
    }
  }
  return false;
}
