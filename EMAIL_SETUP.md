# Email Configuration Guide

This guide will help you set up email delivery for the AmeriTrust Insurance admin system.

## Resend Setup (Primary Email Service)

### Step 1: Create Resend Account
1. Go to [Resend.com](https://resend.com) and sign up for an account
2. Verify your email address
3. Complete the onboarding process

### Step 2: Generate API Key
1. In your Resend dashboard, go to "API Keys"
2. Click "Create API Key"
3. Give it a name like "AmeriTrust Insurance"
4. Copy the generated API key (starts with "re_")

### Step 3: Configure Environment Variable
Add this to your `.env.local` file:

```env
RESEND_API_KEY=re_your_actual_api_key_here
```

**IMPORTANT:** The `RESEND_API_KEY` is required for the application to build and run properly. Without it, the build process will fail.

## Alternative: Gmail Setup (Legacy)

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Step Verification

### Step 2: Generate App Password
1. In Google Account Security settings
2. Click on "App passwords"
3. Select "Mail" and "Other (custom name)"
4. Enter "AmeriTrust Admin" as the name
5. Copy the generated 16-character password

### Step 3: Configure Environment Variables
Add these to your `.env.local` file:

\`\`\`env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-16-character-app-password
SMTP_FROM=AmeriTrust Insurance Group <your-gmail@gmail.com>
\`\`\`

## Other Email Providers

### Outlook/Hotmail
\`\`\`env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
\`\`\`

### Yahoo Mail
\`\`\`env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
\`\`\`

### Custom SMTP Server
\`\`\`env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your-username
SMTP_PASS=your-password
\`\`\`

## Testing Email Configuration

1. Log into the admin dashboard
2. Click the "Test Email" button in the top right
3. Enter your email address
4. Click "Send Test Email"
5. Check your inbox for the test message

## Troubleshooting

### Common Issues

**"Authentication failed"**
- Double-check your username and password
- For Gmail, ensure you're using an App Password, not your regular password
- Verify 2FA is enabled for Gmail

**"Connection timeout"**
- Check your SMTP_HOST and SMTP_PORT settings
- Ensure your server allows outbound connections on port 587
- Try port 465 with secure: true for some providers

**"Email not delivered"**
- Check spam/junk folders
- Verify the recipient email address is correct
- Check your email provider's sending limits

### Environment Variables Checklist

- [ ] RESEND_API_KEY is set (required for build)
- [ ] SMTP_HOST is correct for your provider
- [ ] SMTP_PORT is correct (usually 587 or 465)
- [ ] SMTP_USER is your full email address
- [ ] SMTP_PASS is correct (App Password for Gmail)
- [ ] SMTP_FROM is properly formatted

## Security Notes

- Never commit your `.env.local` file to version control
- Use App Passwords instead of regular passwords when available
- Consider using a dedicated email account for system notifications
- Regularly rotate your email passwords

## Production Deployment

For production deployment on Vercel:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add RESEND_API_KEY with your production API key
4. Add any additional SMTP_* variables if using fallback email
4. Redeploy your application

The email system will automatically use these environment variables in production.
\`\`\`
