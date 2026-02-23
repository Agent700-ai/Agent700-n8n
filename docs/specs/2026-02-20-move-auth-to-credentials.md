# Move Authentication to Credential File via preAuthentication

**Date:** 2026-02-20
**Status:** Draft
**Author:** AI-assisted

---

## Problem & Motivation

Authentication logic (`loginWithAppPassword`) is duplicated in both node files:
- `nodes/Agent700Agent/Agent700Agent.node.ts` (lines 12-31)
- `nodes/Agent700ContextLibrary/Agent700ContextLibrary.node.ts` (lines 12-29)

Both functions POST to `/api/auth/app-login` with the app password, extract an `accessToken`, and attach it as a `Bearer` token to subsequent requests. This violates DRY and means the credential cannot be used with n8n's built-in HTTP Request node.

n8n provides a first-class mechanism for this pattern: `preAuthentication` + `authenticate` on `ICredentialType`. Moving the token exchange into the credential file lets n8n manage the token lifecycle (including expirable token support) and makes the credential reusable across any node that supports credential-based auth.

## Goals

1. Centralize authentication in `Agent700AppPasswordApi.credentials.ts` using `preAuthentication()` and `authenticate`.
2. Nodes use `httpRequestWithAuthentication` instead of manual token management.
3. The credential works with n8n's built-in HTTP Request node out of the box.
4. Eliminate the duplicated `loginWithAppPassword` function from both node files.

## Non-Goals

- Changing the Agent700 API contract or the `/api/auth/app-login` endpoint.
- Adding custom token caching or refresh logic beyond n8n's built-in `expirable` behavior.
- Changing the credential's user-facing properties (baseUrl, appPassword).
- Modifying any node functionality beyond auth plumbing.

## P1 Functional Requirements

| ID  | Requirement |
|-----|-------------|
| FR1 | Credential has a hidden expirable `sessionToken` property |
| FR2 | `preAuthentication()` calls `POST /api/auth/app-login` with `{ token: appPassword }` and returns `{ sessionToken: <accessToken> }` |
| FR3 | `authenticate` injects `Authorization: Bearer <sessionToken>` header into all requests |
| FR4 | Neither node file contains `loginWithAppPassword` or manual `Authorization` header logic |
| FR5 | Both nodes use `httpRequestWithAuthentication` for all API calls |

## Acceptance Criteria

| ID  | Given | When | Then |
|-----|-------|------|------|
| AC1 | A credential with a valid `appPassword` | `preAuthentication` is invoked | It returns `{ sessionToken: <accessToken> }` from the app-login response |
| AC2 | A credential with a populated `sessionToken` | `authenticate` is applied to a request | The request includes `Authorization: Bearer <sessionToken>` header |
| AC3 | A node is executing an API call | It makes any Agent700 API request | It calls `httpRequestWithAuthentication` (not `httpRequest` with a manual auth header) |
| AC4 | The credential is configured in n8n | A user selects it in the HTTP Request node | Requests are authenticated automatically via the credential's `authenticate` + `preAuthentication` flow |

## Technical Design

### Reference Pattern

n8n's [MetabaseApi.credentials.ts](https://github.com/n8n-io/n8n/blob/master/packages/nodes-base/credentials/MetabaseApi.credentials.ts) implements the same pattern:
- Hidden expirable `sessionToken` property
- `preAuthentication()` method for token exchange
- `authenticate` generic property for header injection

### Credential File Changes

**File:** `credentials/Agent700AppPasswordApi.credentials.ts`

- Add `sessionToken` hidden expirable property
- Add `preAuthentication()` async method
- Add `authenticate: IAuthenticateGeneric` property
- Update `test` request to work through the authenticate flow

### Node File Changes

**Files:** `nodes/Agent700Agent/Agent700Agent.node.ts`, `nodes/Agent700ContextLibrary/Agent700ContextLibrary.node.ts`

- Remove `loginWithAppPassword()` function
- Remove `ApplicationError` import
- Replace `this.helpers.httpRequest(...)` + manual `Authorization` header with `this.helpers.httpRequestWithAuthentication.call(this, 'agent700AppPasswordApi', ...)`
- Keep `getCredentials` only for extracting `baseUrl`

### Test Changes

- Credential tests: verify new properties and methods
- Node tests: mock `httpRequestWithAuthentication` instead of `httpRequest` for API calls; remove auth-call mocks from chains
- Mock helper: add `httpRequestWithAuthentication` to the helpers object

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| `httpRequestWithAuthentication` behaves differently than `httpRequest` | Characterization tests capture current behavior; integration tests validate end-to-end |
| `preAuthentication` not called when expected | n8n calls it when the expirable property is empty; covered by credential test |
| Breaking existing workflows | Node interface (inputs/outputs/parameters) is unchanged; only internal auth plumbing changes |
