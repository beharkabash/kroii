# Security Documentation - Kroi Auto Center

## Overview

This document outlines the comprehensive security measures implemented in the Kroi Auto Center Next.js application. All security implementations follow OWASP Top 10 guidelines and industry best practices.

## Table of Contents

1. [Security Headers](#security-headers)
2. [Input Validation & Sanitization](#input-validation--sanitization)
3. [Rate Limiting](#rate-limiting)
4. [Error Handling](#error-handling)
5. [Environment Variables](#environment-variables)
6. [API Security](#api-security)
7. [OWASP Top 10 Compliance](#owasp-top-10-compliance)
8. [Security Best Practices](#security-best-practices)
9. [Incident Response](#incident-response)
10. [Security Checklist](#security-checklist)

---

## Security Headers

### Implementation Location
`/middleware.ts`

### Headers Configured

#### Content Security Policy (CSP)
**Purpose**: Prevents XSS attacks by controlling resource loading

```typescript
default-src 'self';
script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
img-src 'self' blob: data: https:;
font-src 'self' https://fonts.gstatic.com data:;
connect-src 'self' https://www.google-analytics.com;
frame-ancestors 'none';
```

#### HTTP Strict Transport Security (HSTS)
**Purpose**: Enforces HTTPS connections
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

#### X-Frame-Options
**Purpose**: Prevents clickjacking attacks
```
X-Frame-Options: DENY
```

#### X-Content-Type-Options
**Purpose**: Prevents MIME type sniffing
```
X-Content-Type-Options: nosniff
```

#### Referrer-Policy
**Purpose**: Controls referrer information
```
Referrer-Policy: strict-origin-when-cross-origin
```

#### Permissions-Policy
**Purpose**: Controls browser features
```
Permissions-Policy: camera=(), microphone=(), geolocation=(self)
```

---

## Input Validation & Sanitization

### Implementation Location
`/app/lib/validation.ts`

### Validation Schema (Zod)

#### Contact Form Validation
```typescript
{
  name: string (2-100 chars, letters only)
  email: string (valid email format)
  phone: string (optional, Finnish format)
  message: string (10-5000 chars)
}
```

### Security Checks

#### 1. SQL Injection Prevention
- Pattern detection for SQL keywords
- Parameterized queries (when database is added)
- Input sanitization

#### 2. XSS Prevention
- HTML tag removal
- JavaScript protocol blocking
- Event handler removal
- Output encoding

#### 3. Input Sanitization Functions

```typescript
sanitizeHtml()    // Removes HTML tags and dangerous chars
sanitizeString()  // HTML entity encoding
isInputSafe()     // Comprehensive safety check
```

### Body Size Validation
- Maximum request size: 100KB
- Prevents DoS attacks via large payloads

---

## Rate Limiting

### Implementation Location
`/app/lib/rate-limit.ts`

### Configuration

#### Contact Form
- **Limit**: 3 requests per minute
- **Window**: 60 seconds
- **Response**: 429 Too Many Requests

#### General API
- **Limit**: 30 requests per minute
- **Window**: 60 seconds

### Identifier Strategy
1. CF-Connecting-IP (Cloudflare)
2. X-Real-IP
3. X-Forwarded-For (first IP)
4. Fallback: User-Agent + Accept-Language hash

### Storage
- In-memory store (development)
- **Production Recommendation**: Redis or similar

### Automatic Cleanup
- Runs every 10 minutes
- Removes expired entries

---

## Error Handling

### Implementation Location
`/app/lib/error-handler.ts`

### Principles

#### 1. Never Expose Internal Details
- Generic user-facing messages
- Detailed server-side logging
- No stack traces to users

#### 2. Structured Error Types
```typescript
ValidationError     // 400
RateLimitError      // 429
UnauthorizedError   // 401
NotFoundError       // 404
InternalError       // 500
```

#### 3. Secure Logging
- Sanitize sensitive data
- Redact passwords, tokens, keys
- IP address anonymization
- PII protection

#### 4. Security Event Logging
```typescript
{
  type: 'rate_limit' | 'malicious_input' | 'auth_failure'
  severity: 'low' | 'medium' | 'high' | 'critical'
  ip: string (anonymized)
  userAgent: string
  endpoint: string
  timestamp: string
}
```

---

## Environment Variables

### Implementation Location
`/app/lib/env.ts`

### Validation
All environment variables are validated at startup using Zod schema:

```typescript
NODE_ENV                        // Required
NEXT_PUBLIC_GA_MEASUREMENT_ID   // Optional (validated format)
RESEND_API_KEY                  // Optional (validated format)
CONTACT_EMAIL                   // Required (validated email)
RATE_LIMIT_MAX_REQUESTS         // Optional (default: 10)
RATE_LIMIT_WINDOW_MS            // Optional (default: 60000)
```

### Security Measures
- Type-safe access
- Runtime validation
- Format verification
- Default values
- No sensitive data in client bundles

---

## API Security

### Implementation Location
`/app/api/contact/route.ts`

### Security Layers

#### Layer 1: Rate Limiting
- Prevents abuse and DoS attacks
- Per-IP tracking
- Configurable limits

#### Layer 2: Request Validation
- JSON parsing with error handling
- Body size limits (100KB max)
- Content-Type verification

#### Layer 3: Input Validation
- Zod schema validation
- Field-level error messages
- Type-safe data access

#### Layer 4: Security Scanning
- SQL injection patterns
- XSS patterns
- Malicious input detection

#### Layer 5: Sanitization
- HTML encoding
- Special character handling
- Whitespace normalization

#### Layer 6: Audit Logging
- Request metadata
- Sanitized input
- IP address (anonymized)
- Timestamp
- User agent

### HTTP Method Restrictions
- Only POST allowed for `/api/contact`
- All other methods return 405 Method Not Allowed

---

## OWASP Top 10 Compliance

### A01:2021 - Broken Access Control
**Status**: ✅ Implemented
- Rate limiting per IP
- Request validation
- Method restrictions

### A02:2021 - Cryptographic Failures
**Status**: ✅ Implemented
- HTTPS enforced (HSTS)
- No sensitive data in logs
- Environment variable encryption

### A03:2021 - Injection
**Status**: ✅ Implemented
- SQL injection prevention (patterns + future parameterized queries)
- XSS prevention (CSP + sanitization)
- Command injection prevention (no shell execution)

### A04:2021 - Insecure Design
**Status**: ✅ Implemented
- Security-first architecture
- Defense in depth
- Fail-safe defaults

### A05:2021 - Security Misconfiguration
**Status**: ✅ Implemented
- Comprehensive security headers
- Disabled unnecessary features
- Environment variable validation
- No default credentials

### A06:2021 - Vulnerable and Outdated Components
**Status**: ✅ Maintained
- Regular dependency updates
- `npm audit` in CI/CD
- Minimal dependencies
- Verified packages only

### A07:2021 - Identification and Authentication Failures
**Status**: ✅ Prepared
- Authentication patterns ready
- Session management planned
- MFA support prepared

### A08:2021 - Software and Data Integrity Failures
**Status**: ✅ Implemented
- Input validation
- CSP for script integrity
- No eval() usage
- Secure dependencies

### A09:2021 - Security Logging and Monitoring Failures
**Status**: ✅ Implemented
- Comprehensive logging
- Security event tracking
- Error monitoring
- Audit trails

### A10:2021 - Server-Side Request Forgery (SSRF)
**Status**: ✅ Implemented
- No user-controlled URLs
- URL validation when needed
- Whitelist approach

---

## Security Best Practices

### Development

#### 1. Code Review
- Security-focused reviews
- OWASP checklist
- Peer review required

#### 2. Testing
- Security test cases
- Input fuzzing
- Penetration testing

#### 3. Dependencies
```bash
# Check for vulnerabilities
npm audit

# Update dependencies
npm update

# Check for outdated packages
npm outdated
```

### Deployment

#### 1. Environment Configuration
- Use platform environment variables (Vercel, AWS, etc.)
- Never commit `.env` files
- Rotate secrets regularly (90 days)
- Use separate keys for dev/staging/prod

#### 2. Monitoring
- Set up error tracking (Sentry, DataDog)
- Configure alerts for:
  - High rate limit violations
  - Malicious input attempts
  - Server errors (5xx)
  - Authentication failures

#### 3. HTTPS Configuration
- TLS 1.3 minimum
- Strong cipher suites
- HSTS preload
- Certificate monitoring

### Incident Response

#### 1. Detection
- Monitor security logs
- Alert on suspicious patterns
- Track failed requests

#### 2. Response
1. Identify affected systems
2. Isolate if necessary
3. Collect evidence
4. Analyze attack vector
5. Implement fixes
6. Document incident

#### 3. Recovery
1. Verify fixes
2. Monitor for recurrence
3. Update security measures
4. Conduct post-mortem

---

## Security Checklist

### Pre-Deployment

- [ ] All environment variables configured
- [ ] Security headers tested
- [ ] Rate limiting functional
- [ ] Input validation working
- [ ] Error handling secure
- [ ] HTTPS enforced
- [ ] CSP configured correctly
- [ ] No sensitive data in logs
- [ ] Dependencies up to date
- [ ] `npm audit` clean

### Post-Deployment

- [ ] Monitor error logs
- [ ] Check rate limit metrics
- [ ] Verify HTTPS redirect
- [ ] Test security headers (securityheaders.com)
- [ ] Test form validation
- [ ] Verify email delivery
- [ ] Check analytics tracking
- [ ] Test on mobile devices

### Regular Maintenance (Monthly)

- [ ] Review security logs
- [ ] Update dependencies
- [ ] Rotate API keys
- [ ] Check for CVEs
- [ ] Review access logs
- [ ] Test backup/restore
- [ ] Update documentation

---

## Testing Security

### Manual Testing

#### 1. Input Validation
```bash
# Test SQL injection
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"test OR 1=1","email":"test@test.com","message":"test"}'

# Test XSS
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"<script>alert(1)</script>","email":"test@test.com","message":"test"}'
```

#### 2. Rate Limiting
```bash
# Send multiple requests rapidly
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/contact \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@test.com","message":"Test message"}' &
done
```

#### 3. Security Headers
```bash
# Check headers
curl -I https://kroiautocenter.fi

# Use security scanning tools
npx @doyensec/electronegativity --input .
```

### Automated Testing
```bash
# Security audit
npm audit

# Dependency check
npm outdated

# OWASP ZAP scan
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t https://kroiautocenter.fi
```

---

## Reporting Security Issues

If you discover a security vulnerability, please email:
**security@kroiautocenter.fi**

Include:
1. Description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. Suggested fix (if any)

We will respond within 48 hours and provide updates every 5 days until resolved.

---

## Security Contact

**Security Team**: security@kroiautocenter.fi
**General Contact**: kroiautocenter@gmail.com
**Phone**: +358 41 3188214

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0   | 2025-01-XX | Initial security implementation |

---

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Next.js Security Best Practices](https://nextjs.org/docs/pages/building-your-application/configuring/security-headers)
- [CSP Reference](https://content-security-policy.com/)
- [Mozilla Web Security Guidelines](https://infosec.mozilla.org/guidelines/web_security)

---

**Last Updated**: January 2025
**Maintained By**: Development Team
**Review Frequency**: Quarterly