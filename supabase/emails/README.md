# Auth email templates

Paste each `.html` into Supabase → Authentication → Emails (Invite user, Magic link, Reset password) with the matching subject. Editing templates requires a custom SMTP sender on the project (Authentication → Emails → SMTP Settings); without one Supabase sends its default text and caps sending at a few emails per hour.

The invite template reads `invited_to` and `invited_by` from the user metadata set by the `invite` edge function.

Links use `{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=…` instead of `{{ .ConfirmationURL }}`. The app shows a Continue button and only then calls `verifyOtp`, so mail scanners that open links (Google's included) can't use up the single-use token before the person clicks.
