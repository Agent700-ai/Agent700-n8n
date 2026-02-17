# n8n Submission Readiness – @a700/n8n-nodes-agent700

**Last checked:** 2026-02-16  
**Next version to publish:** 1.2.2 (so npm has production README + engines)

---

## npm vs local

| Item | On npm (1.2.1) | Local (1.2.2) | n8n requirement |
|------|----------------|----------------|-----------------|
| Package name | `@a700/n8n-nodes-agent700` ✅ | same | Scoped or unscoped `n8n-nodes-*` ✅ |
| Keyword | `n8n-community-node-package` ✅ | same | Required ✅ |
| Repository | `git+https://github.com/Agent700-ai/Agent700-n8n.git` ✅ | same | Recommended ✅ |
| README | Old (build from source first, old folder names) | **New** (Install from npm first, correct names) | Clear install + auth ✅ |
| engines | Not set | `"node": ">=18.0.0"` | Recommended ✅ |
| Dependencies | Only `n8n-workflow` (peer) ✅ | same | No extra runtime deps ✅ |
| n8n.nodes + credentials | Both nodes + credentials listed ✅ | same | Required ✅ |
| Lint/build | — | Pass ✅ | Required ✅ |

---

## What to do before submitting to n8n

1. **Publish 1.2.2 to npm** so the listing has the production README and engines:
   ```bash
   npm publish --access public
   ```
   (Complete browser auth if prompted.)

2. **Submit in Creator Portal** using:
   - **Package name:** `@a700/n8n-nodes-agent700`
   - **npm URL:** https://www.npmjs.com/package/@a700/n8n-nodes-agent700
   - **Repository:** https://github.com/Agent700-ai/Agent700-n8n
   - **Category:** e.g. AI/ML or Integration
   - **Description:** From package (or short: “Agent700 AI nodes for n8n: chat and context library.”)

3. **Optional:** Push your branch so GitHub is up to date:
   ```bash
   git push origin main
   ```

---

## n8n checklist (all satisfied with 1.2.2)

- [x] Package name follows `n8n-nodes-*` / `@scope/n8n-nodes-*`
- [x] Keyword `n8n-community-node-package`
- [x] `n8n` section: nodes + credentials paths correct
- [x] No runtime deps except `n8n-workflow` (peer)
- [x] Version is semver (1.2.2)
- [x] Repository, author, license set
- [x] README: install (npm first), auth, node list
- [x] Node 18+ engines
- [x] Build and lint pass

**Verdict:** Ready to submit to n8n after you publish **1.2.2** to npm.
