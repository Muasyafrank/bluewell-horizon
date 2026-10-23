# Sending email

Quotations, invoices and notifications are sent from your own Gmail account, by
one of two routes. Set `EMAIL_USER` (the Gmail address) either way.

## Route 1: Gmail SMTP with an app password (simplest)

```
EMAIL_USER=you@gmail.com
EMAIL_PASS=<16-character app password>
```

Create the app password at https://myaccount.google.com/apppasswords (2-Step
Verification must be on). This uses mail ports (587), which some networks and
hosting plans block. If sending times out, use route 2.

## Route 2: Gmail web API over HTTPS (works where mail ports are blocked)

Same Gmail account, sent over port 443 like any website, so it is not blocked.
One-time setup, about 15 minutes:

1. Go to https://console.cloud.google.com/ and create a project (any name).
2. **APIs & Services → Library → Gmail API → Enable.**
3. **APIs & Services → OAuth consent screen** (or "Google Auth platform"):
   user type **External**, fill in the app name and your email, and add your own
   Gmail address as a **test user**.
4. **Publishing status → Publish app (In production).** This matters: while the app
   is in "Testing", Google expires the refresh token after 7 days and sending
   stops. You do not need Google's verification for your own account; the sign-in
   screen will show "Google hasn't verified this app", which is expected. Choose
   **Advanced → Go to (app name)**.
5. **Credentials → Create credentials → OAuth client ID → Application type:
   Desktop app.** Copy the client ID and client secret.
6. Run the helper once on your computer:
   ```
   cd backend_fastapi
   python gmail_authorize.py
   ```
   Paste the client ID and secret, open the link it prints, sign in with the Gmail
   account that should send the mail, and allow "Send email on your behalf".
7. Copy the three lines it prints into `backend_fastapi/.env` (with `EMAIL_USER`
   set to that same Gmail address), then restart the backend:
   ```
   GMAIL_CLIENT_ID=...
   GMAIL_CLIENT_SECRET=...
   GMAIL_REFRESH_TOKEN=...
   ```

When all three `GMAIL_*` values are set the web API is used instead of SMTP. The
permission requested is "send only": the app cannot read or delete your mail.

## Notes
- Quotations and invoices are copied (Cc) to `EMAIL_USER` so the business keeps a record.
- Changing the Gmail password does not break route 2. Removing the app at
  https://myaccount.google.com/permissions does; run the helper again.
- Gmail limits sending to about 500 messages a day on a normal account.
- Never commit `.env` or share these values.
