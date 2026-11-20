# Shared approval review
Website baseline 15e2d55. Android baseline 1b28591. Both review branches are named review/shared-approval.

## Changed files

standalone/initials-workspace.js, tests/test_workspace_session.mjs, tests/test_cloudflare_worker.mjs, .github/workflows/checks.yml, SHARED_APPROVAL.md and this report.

## Test results

All pre-existing tests listed below passed at baseline and after implementation. The new website client regression first failed because an unbound workspace accepted an approved response. The Android host fixture first failed compilation because the shared production decision class did not exist.

- browser_initials.py — passed
- browser_responsive.py — passed
- test_account_relay.mjs — passed
- test_bootstrap.mjs — passed
- test_branding.mjs — passed
- test_browser_requests.js — passed
- test_case_policy.mjs — passed
- test_clinical_delivery.js — passed
- test_cloudflare_connection.py — passed
- test_cloudflare_worker.mjs — passed
- test_data_fetch.js — passed
- test_migration_export.mjs — passed
- test_search.mjs — passed
- test_search_submission.py — passed
- test_standalone.mjs — passed
- test_startup_browser.py — passed
- test_web_refinements.py — passed
- test_website_build.py — passed
- test_website_samples.js — passed
- test_workspace_session.mjs — passed

The Android packaged browser smoke and synthetic AI browser tests both passed before and after, using local clinical assets. Android app sources and all four instrumentation classes compiled against API 35. The new JVM session test passed for approved owners and members, all denied states, unknown roles, invalid identity, HTTP denial, unexpected server statuses and an offline exception.

The Worker test used an in-memory schema and two independent sessions for one synthetic member. One owner's decisions changed website access and both GET /api/session responses across pending, approved, rejected, reapproved and revoked. Signing out the phone left the other session authenticated. A member could not perform owner actions. With ANDROID_POLICY_CLASSES set to the compiled host classes, the Worker test also ran Android's production decision function against each returned identity, role and status. Browser checks covered missing identity, an in-flight approved response after disconnection, failed refresh and recovery after fresh approval.

## Release readiness

Ready for source review. Device-level acceptance remains pending. No device was attached. The existing instrumentation builder signs its QA APK, so only the compile phase was run. The integration check exercised the Worker and production Java decision code, without Android WebView, CookieManager, Keystore, physical lock or Activity lifecycle execution. Browser fixture tests do not measure real network timing. Revocation takes effect at recheck, including periodic foreground checks.

No production writes, deployment, merge, signing or release publication occurred. No production credentials are required for host tests. Existing host, database, package, signing and update identities are unchanged. Clinical records remain local and distinct per platform. Review both PRs together. Before release, authorize a separate QA device run with isolated synthetic accounts and a test backend to validate pause, resume, lock, disconnect, account switching and revocation.
