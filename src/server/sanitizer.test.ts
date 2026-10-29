import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeText, sanitizeEmail, sanitizePhone, isHoneypotTriggered } from './sanitizer';
import { RateLimiter } from './rateLimiter';

test('sanitizeText strips dangerous HTML characters', () => {
  const dirty = '<script>alert("xss")</script>Hello World!';
  const clean = sanitizeText(dirty);
  assert.equal(clean.includes('<'), false);
  assert.equal(clean.includes('>'), false);
  assert.ok(clean.includes('Hello World!'));
});

test('sanitizeEmail cleans and lowercases', () => {
  assert.equal(sanitizeEmail('  Contact@ElloraDigital.IN  '), 'contact@elloradigital.in');
});

test('isHoneypotTriggered detects bot traps', () => {
  assert.equal(isHoneypotTriggered({ website_trap: 'http://spam.com' }), true);
  assert.equal(isHoneypotTriggered({ company_url: 'spammer' }), true);
  assert.equal(isHoneypotTriggered({ website_trap: '', fullName: 'Rajesh' }), false);
  assert.equal(isHoneypotTriggered({ fullName: 'Rajesh' }), false);
});

test('RateLimiter enforces thresholds per key', () => {
  const limiter = new RateLimiter(5000, 3);
  const ip = '192.168.1.100';

  assert.equal(limiter.check(ip).allowed, true);
  assert.equal(limiter.check(ip).allowed, true);
  assert.equal(limiter.check(ip).allowed, true);

  const fourth = limiter.check(ip);
  assert.equal(fourth.allowed, false);
  assert.ok(fourth.retryAfterSeconds > 0);

  // Different IP should still be allowed
  assert.equal(limiter.check('192.168.1.200').allowed, true);
});
