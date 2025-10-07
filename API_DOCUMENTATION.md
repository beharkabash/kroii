# Kroi Auto Center - API Documentation

Complete documentation for all API endpoints and integrations.

## Table of Contents

- [Authentication](#authentication)
- [Rate Limiting](#rate-limiting)
- [Contact Form API](#contact-form-api)
- [Newsletter API](#newsletter-api)
- [Analytics Integration](#analytics-integration)
- [Email Service](#email-service)
- [Error Handling](#error-handling)
- [Security](#security)

---

## Authentication

Currently, all public APIs are **unauthenticated** but protected by rate limiting. Future admin APIs will require authentication.

---

## Rate Limiting

All API endpoints implement rate limiting to prevent abuse.

### Rate Limit Headers

All responses include rate limit information:

```
X-RateLimit-Limit: 3
X-RateLimit-Remaining: 2
X-RateLimit-Reset: 1679875200000
```

### Rate Limit Rules

- **Contact Form**: 3 requests per minute per IP
- **Newsletter**: 3 requests per minute per IP
- **General API**: 30 requests per minute per IP

### Rate Limit Response (429)

```json
{
  "error": "Liian monta yritystä. Odota hetki ja yritä uudelleen.",
  "retryAfter": 45
}
```

---

## Contact Form API

### POST `/api/contact`

Submit a contact form with optional car interest.

#### Request

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Matti Meikäläinen",
  "email": "matti@example.com",
  "phone": "+358 40 123 4567",
  "message": "Olen kiinnostunut BMW 320d autosta. Voinko tulla koeajolle?",
  "carInterest": "BMW 320d 2020"
}
```

**Field Specifications:**
- `name` (required): 2-100 characters, letters only (including ä, ö, å)
- `email` (required): Valid email format, 5-255 characters
- `phone` (optional): Finnish or international format, min 7 digits
- `message` (required): 10-2000 characters
- `carInterest` (optional): Name of car user is interested in

#### Response

**Success (200):**
```json
{
  "success": true,
  "message": "Viesti lähetetty onnistuneesti! Otamme sinuun yhteyttä pian."
}
```

**Validation Error (400):**
```json
{
  "error": "Nimi on liian lyhyt",
  "field": "name"
}
```

**Rate Limit Error (429):**
```json
{
  "error": "Liian monta yritystä. Odota hetki ja yritä uudelleen.",
  "retryAfter": 45
}
```

**Server Error (500):**
```json
{
  "error": "Palvelinvirhe. Yritä myöhemmin uudelleen tai ota yhteyttä puhelimitse."
}
```

#### Automated Actions

When a contact form is submitted:

1. **Lead Scoring** - Automatically calculates lead quality (0-100)
2. **Email Notification** - Sends email to business with lead details
3. **Auto-Responder** - Sends confirmation email to customer
4. **Analytics Event** - Tracks `contact_form_submit` in GA4
5. **Logging** - Records submission with lead score

#### Lead Scoring

The system automatically scores each lead based on:

- Phone number provided: +20 points
- Business email: +10 points (personal email: +5)
- Full name: +10 points (partial: +5)
- Detailed message (>100 chars): +30 points
- Specific car interest: +30 points
- Urgent keywords (nyt, heti, pian): +10 bonus
- Purchase intent keywords (ostaa, rahoitus): +10 bonus

**Quality Levels:**
- High: 70-100 points (priority response)
- Medium: 40-69 points (standard response)
- Low: 0-39 points (general inquiry)

---

## Newsletter API

### POST `/api/newsletter`

Subscribe to newsletter.

#### Request

**Body:**
```json
{
  "email": "matti@example.com",
  "name": "Matti Meikäläinen"
}
```

**Field Specifications:**
- `email` (required): Valid email format, 5-255 characters
- `name` (optional): 2-100 characters

#### Response

**Success (200):**
```json
{
  "success": true,
  "message": "Kiitos tilauksesta! Saat vahvistuksen sähköpostitse."
}
```

**Error responses**: Same format as Contact Form API

#### Automated Actions

1. **Confirmation Email** - Sends welcome email to subscriber
2. **Analytics Event** - Tracks `newsletter_signup` in GA4
3. **Logging** - Records subscription

---

## Analytics Integration

### Google Analytics 4 Events

All events are tracked automatically with privacy-compliant settings.

#### Standard Events

| Event Name | Trigger | Parameters |
|------------|---------|------------|
| `page_view` | Page navigation | page_path, page_title |
| `view_item` | Car listing view | item_id, item_name, price |
| `generate_lead` | Any contact action | value, currency |
| `sign_up` | Newsletter subscription | method: 'newsletter' |
| `scroll` | Scroll depth (25/50/75/100%) | percent_scrolled |
| `user_engagement` | Time on page | engagement_time_msec |

#### Custom Events

| Event Name | Trigger | Parameters |
|------------|---------|------------|
| `car_view` | Car detail page view | car_id, car_name, car_price |
| `contact_form_submit` | Contact form submission | method, car_interest, lead_score |
| `whatsapp_click` | WhatsApp button click | car_interest |
| `phone_click` | Phone link click | method: 'phone' |
| `email_click` | Email link click | method: 'email' |
| `social_click` | Social media link | platform |

### Using Analytics in Code

```typescript
import { trackCarView, trackWhatsAppClick } from '@/app/lib/analytics';

// Track car view
trackCarView({
  car_id: 'bmw-320d-2020',
  car_name: 'BMW 320d 2020',
  car_price: '24 990 €',
  car_year: '2020',
  car_brand: 'BMW'
});

// Track WhatsApp click
trackWhatsAppClick('BMW 320d 2020');
```

---

## Email Service

### Resend Integration

The application uses [Resend](https://resend.com) for email delivery.

#### Email Templates

1. **Contact Notification** - Sent to business
   - Professional HTML template
   - Includes lead score badge
   - Quick action buttons (Reply, WhatsApp)
   - Customer information summary

2. **Auto-Responder** - Sent to customer
   - Confirmation of submission
   - Company information
   - Call-to-action buttons
   - Social media links

3. **Newsletter Confirmation** - Sent to subscriber
   - Welcome message
   - Benefits of subscription
   - Link to website

#### Email Features

- **Retry Logic**: Exponential backoff (3 attempts)
- **Delivery Tracking**: Message IDs logged
- **Error Handling**: Graceful failure (doesn't block form submission)
- **Email Tags**: For analytics and filtering in Resend dashboard
- **Reply-To**: Set to customer email for easy responses

#### Setup Requirements

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (recommended) or use test domain
3. Add DNS records for domain verification
4. Create API key
5. Set `RESEND_API_KEY` environment variable

---

## Error Handling

### Error Response Format

All errors follow consistent JSON format:

```json
{
  "error": "Human-readable error message in Finnish",
  "field": "fieldName",
  "retryAfter": 45
}
```

### HTTP Status Codes

- `200` - Success
- `400` - Validation error or malformed request
- `405` - Method not allowed
- `413` - Request body too large
- `429` - Rate limit exceeded
- `500` - Server error

### Client-Side Error Handling

```typescript
try {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });

  if (!response.ok) {
    const error = await response.json();

    if (response.status === 429) {
      // Handle rate limit
      alert(`Too many requests. Retry in ${error.retryAfter}s`);
    } else if (response.status === 400) {
      // Handle validation error
      alert(error.error);
    } else {
      // Handle server error
      alert('Server error. Please try again later.');
    }
  } else {
    const data = await response.json();
    alert(data.message);
  }
} catch (error) {
  // Handle network error
  alert('Network error. Please check your connection.');
}
```

---

## Security

### Input Validation

All inputs are validated with [Zod](https://zod.dev) schemas:

- Length constraints
- Format validation (email, phone)
- Character whitelisting
- XSS prevention
- SQL injection prevention

### Input Sanitization

- HTML tags removed
- JavaScript protocols removed
- Event handlers removed
- Dangerous patterns blocked

### Security Headers

```typescript
// Contact form security checks
- Content-Type validation
- Request size limits (100KB max)
- IP address logging
- User agent tracking
- Malicious pattern detection
```

### Data Protection

- No sensitive data stored
- Email addresses hashed in logs
- IP addresses anonymized after 30 days
- GDPR compliant
- No third-party data sharing

### Best Practices

1. **Never expose internal errors** to clients
2. **Log security events** for monitoring
3. **Rate limit all endpoints** to prevent abuse
4. **Validate all inputs** on server side
5. **Use HTTPS only** in production
6. **Rotate API keys** every 90 days
7. **Monitor API usage** for suspicious patterns

---

## Testing

### cURL Examples

**Test Contact Form:**
```bash
curl -X POST https://kroiautocenter.fi/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+358 40 123 4567",
    "message": "This is a test message with enough characters to pass validation.",
    "carInterest": "BMW 320d 2020"
  }'
```

**Test Newsletter:**
```bash
curl -X POST https://kroiautocenter.fi/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User"
  }'
```

**Test Rate Limiting:**
```bash
# Send 4 requests quickly (4th should fail with 429)
for i in {1..4}; do
  curl -X POST https://kroiautocenter.fi/api/contact \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@example.com","message":"Test message"}' &
done
```

---

## Monitoring

### Logging

All API calls are logged with:
- Timestamp
- IP address (anonymized)
- User agent
- Request parameters (sanitized)
- Response status
- Lead score (for contacts)
- Error details (if any)

### Analytics Dashboard

View in Google Analytics 4:
1. Go to Reports > Events
2. Filter by custom events: `contact_form_submit`, `whatsapp_click`, etc.
3. View lead scores in event parameters

### Email Delivery Monitoring

View in Resend Dashboard:
1. Go to Logs
2. Filter by tags: `contact-notification`, `auto-responder`, `newsletter-confirmation`
3. Check delivery status and open rates

---

## Future Enhancements

- [ ] Admin API with authentication
- [ ] CRM integration (HubSpot/Salesforce)
- [ ] SMS notifications via Twilio
- [ ] File upload support (driver's license, etc.)
- [ ] Database storage for leads
- [ ] Advanced analytics dashboard
- [ ] A/B testing framework
- [ ] Multi-language support
- [ ] Webhook endpoints
- [ ] API versioning

---

## Support

For API issues or questions:
- Email: kroiautocenter@gmail.com
- Phone: +358 41 3188214
- GitHub: [Open an issue](https://github.com/yourusername/kroi-auto-center/issues)

---

**Last Updated**: 2025-09-27
**API Version**: 1.0.0