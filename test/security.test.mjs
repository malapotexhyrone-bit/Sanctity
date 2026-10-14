import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Firestore rules enforce the public wall contract", async () => {
  const rules = await read("firestore.rules");

  assert.match(rules, /match \/sanctity_wall_posts\/\{postId\}/);
  assert.match(rules, /hasAll\(\['name', 'message', 'createdAt'\]\)/);
  assert.match(rules, /hasOnly\(\['name', 'message', 'createdAt'\]\)/);
  assert.match(rules, /post\.name is string/);
  assert.match(rules, /post\.name\.size\(\) <= 80/);
  assert.match(rules, /post\.message is string/);
  assert.match(rules, /post\.message\.size\(\) <= 1000/);
  assert.match(rules, /post\.createdAt == request\.time/);
  assert.match(rules, /allow update, delete: if false/);
  assert.match(rules, /match \/\{document=\*\*\}[\s\S]*allow read, write: if false/);
});

test("submission form matches the server-enforced limits", async () => {
  const page = await read("involved.html");

  assert.doesNotMatch(page, /field-email/i);
  assert.match(page, /id="field-name"[^>]*maxlength="80"/);
  assert.match(page, /id="field-message"[^>]*maxlength="1000"/);
  assert.match(page, /collection\(db, "sanctity_wall_posts"\)/);
  assert.match(page, /createdAt: serverTimestamp\(\)/);
});

test("wall rendering keeps untrusted content out of HTML", async () => {
  const page = await read("wall.html");

  assert.match(page, /message\.textContent = typeof post\.message/);
  assert.match(page, /name\.textContent = typeof post\.name/);
  assert.doesNotMatch(page, /innerHTML/);
  assert.match(page, /limit\(POST_LIMITS\.wallResults\)/);
});

test("App Check is wired for explicit reCAPTCHA Enterprise configuration", async () => {
  const bootstrap = await read("app.js");
  const involved = await read("involved.html");
  const wall = await read("wall.html");

  assert.match(bootstrap, /ReCaptchaEnterpriseProvider/);
  assert.match(bootstrap, /initializeAppCheck/);
  assert.match(involved, /name="firebase-app-check-site-key"/);
  assert.match(wall, /name="firebase-app-check-site-key"/);
});
