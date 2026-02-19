export function uniqueEmail(prefix = 'test'): string {
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `${prefix}-${suffix}@example.com`;
}

export function uniqueName(prefix = 'User'): string {
  return `${prefix}-${Date.now().toString(36)}`;
}
