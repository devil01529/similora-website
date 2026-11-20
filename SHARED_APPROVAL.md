# Shared approval contract

Website baseline 15e2d55. Android baseline 1b28591. Both clients authenticate independently to the same HTTPS origin. Each sends its own secure session cookie to GET /api/session. The Worker resolves its hash against an unexpired session and reads the current user row on every request. A 200 response includes id, email, role and status. Only approved grants workspace access. The id selects the local record scope. Email is display data. Owner and member use the same status check.

An authenticated, approved owner submits POST /api/decision with a member id and approved, rejected or revoked status. The Worker checks the request origin and owner role before updating the shared member row. Both clients observe that decision on their next check. Pending, rejected and revoked users can view account status. Protected workspace requests are forbidden. An absent, expired or signed-out session returns 401. Logout invalidates that session. Malformed responses, transport failures and server errors cannot open the workspace.

Approval does not copy records or cookies across devices. Browser cases stay in account-scoped browser storage. Android records stay in the account's encrypted vault. Revocation is observed on recheck, not via a push notification.
