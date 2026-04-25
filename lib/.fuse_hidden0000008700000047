// Email validation utility with disposable domain checking

const DISPOSABLE_DOMAINS = new Set([
  'tempmail.com',
  'guerrillamail.com',
  '10minutemail.com',
  'mailinator.com',
  'maildrop.cc',
  'sharklasers.com',
  'spam4.me',
  'trashmail.com',
  'throwaway.email',
  'temp-mail.org',
  'yopmail.com',
  'fakeinbox.com',
  'ethereal.email',
  'maildump.com',
  'temp-mail.io',
  'tempmail.io',
  'mail.tm',
  'guerrillamail.info',
  '10minutemail.info',
  '10minutemail.de',
])

export interface EmailValidationResult {
  valid: boolean
  error?: string
  isDisposable?: boolean
}

/**
 * Validates email format and checks against disposable domains
 */
export function validateEmail(email: string): EmailValidationResult {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email é obrigatório' }
  }

  const trimmed = email.trim().toLowerCase()

  // Basic format validation
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmed)) {
    return { valid: false, error: 'Formato de email inválido' }
  }

  // Check email length
  if (trimmed.length > 254) {
    return { valid: false, error: 'Email muito longo' }
  }

  // Extract domain and check against disposable list
  const [, domain] = trimmed.split('@')
  if (!domain) {
    return { valid: false, error: 'Domínio de email inválido' }
  }

  const isDisposable = DISPOSABLE_DOMAINS.has(domain.toLowerCase())
  if (isDisposable) {
    return {
      valid: false,
      error: 'Email descartável não permitido. Use um email permanente.',
      isDisposable: true,
    }
  }

  return { valid: true }
}

/**
 * Check if email is from disposable domain
 */
export function isDisposableEmail(email: string): boolean {
  if (!email) return false
  const domain = email.split('@')[1]?.toLowerCase()
  return domain ? DISPOSABLE_DOMAINS.has(domain) : false
}

/**
 * Get email domain from email address
 */
export function getEmailDomain(email: string): string {
  if (!email) return ''
  const parts = email.split('@')
  return parts.length > 1 ? parts[1].toLowerCase() : ''
}
