# Sanctity

Static website for Project Dignidad. The Freedom Wall uses Cloud Firestore for anonymous, public messages.

## Security model

- Anyone can read individual Freedom Wall posts. Collection reads must specify a limit of 100 posts or fewer.
- Anyone can create a post containing exactly `name`, `message`, and `createdAt`.
- Names are limited to 80 characters and messages to 1,000 characters in both the browser and Firestore rules.
- `createdAt` must be a Firestore server timestamp. Client-supplied timestamps are rejected.
- Updates and deletes are denied to public clients.
- All other Firestore collections are denied by default.
- User content is rendered with DOM `textContent`, not HTML, to prevent stored XSS.
- The Firebase web configuration in `app.js` is a public app identifier, not an administrator credential. Never commit service-account keys, reCAPTCHA secret keys, `.env` files, or other private credentials.

## Deploy the Firestore rules

The checked-in rules do not protect the production database until they are deployed.

1. Install the Firebase CLI and sign in with an account that can manage project `sanctity-9cd57`.
2. From this repository, review `firestore.rules`.
3. Deploy only the rules:

   ```sh
   firebase deploy --only firestore:rules --project sanctity-9cd57
   ```

4. In Firebase Console, open **Firestore Database > Rules** and confirm the deployed rules match this repository.

## Review the Firebase API key

In Google Cloud Console, open **APIs & Services > Credentials** and review the browser key used in `app.js`. Confirm that its API restrictions allow only the Firebase-related APIs this project needs. Do not add unrelated or sensitive APIs, such as the Generative Language API, to this public browser key.

## Enable Firebase App Check

App Check needs a domain-specific public site key and Firebase Console configuration, so the integration is present but intentionally inactive until these steps are completed.

1. In Google Cloud Console, create a **reCAPTCHA Enterprise website key** for every production hostname that serves this site. Localhost can be added temporarily for testing.
2. In Firebase Console, open **App Check**, select the Sanctity web app, choose **reCAPTCHA Enterprise**, and register the same site key.
3. Put the public site key in the empty `firebase-app-check-site-key` meta tag in both `involved.html` and `wall.html`. The site key is safe to publish; do not commit any reCAPTCHA secret or service-account credential.
4. Deploy the site and verify that Firestore requests appear as **verified** under **App Check > APIs > Cloud Firestore**.
5. Monitor metrics until legitimate production traffic is verified. Then enable App Check enforcement for Cloud Firestore. Enabling enforcement before the site key is deployed will block the site.

## Verification checklist

After deploying the rules and App Check configuration:

- Run `npm test` locally to check that the rules, form limits, safe rendering, and App Check integration remain aligned.
- Submit a normal post and confirm it appears on the Freedom Wall.
- Confirm a name over 80 characters and a message over 1,000 characters are rejected by the browser.
- Use the Firestore Rules Playground or Emulator Suite to confirm extra fields, client timestamps, updates, deletes, and writes to other collections are denied.
- Confirm the Freedom Wall query returns no more than 100 newest posts.
