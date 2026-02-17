# How to Submit Agent700 Nodes to n8n for Verification

This guide walks you through the complete process of submitting your Agent700 custom nodes to n8n for community verification and inclusion in their product.

## Table of Contents

1. [Prerequisites & Requirements](#1-prerequisites--requirements)
2. [Package Configuration Updates](#2-package-configuration-updates)
3. [Code Quality & Standards](#3-code-quality--standards)
4. [Documentation Requirements](#4-documentation-requirements)
5. [Build & Test Process](#5-build--test-process)
6. [Publishing to npm](#6-publishing-to-npm)
7. [Submission via Creator Portal](#7-submission-via-creator-portal)
8. [Verification Process](#8-verification-process)
9. [Post-Approval](#9-post-approval)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Prerequisites & Requirements

### 1.1 Package Naming Conventions

Your package **must** follow one of these naming patterns:

- **Unscoped**: `n8n-nodes-<your-name>`
  - Example: `n8n-nodes-agent700`
- **Scoped**: `@<scope>/n8n-nodes-<your-name>`
  - Example: `@agent700/n8n-nodes-agent700`

**Current Status**: ✅ Package is named `@a700/n8n-nodes-agent700` (scoped convention).

### 1.2 Required Keywords

Your `package.json` **must** include the keyword `n8n-community-node-package`:

```json
{
  "keywords": [
    "n8n",
    "n8n-community-node-package",
    "agent700"
  ]
}
```

**Current Status**: ✅ Keyword `n8n-community-node-package` is present.

### 1.3 Account Setup

Before submitting, ensure you have:

- ✅ **npm account**: Sign up at [npmjs.com](https://www.npmjs.com/signup)
- ✅ **n8n Creator Portal account**: Sign up at [n8n.io/creator-portal](https://n8n.io/creator-portal)
- ✅ **GitHub account** (recommended for hosting documentation and examples)

### 1.4 Development Tools

Install required tools:

```bash
# Install n8n globally (for local testing)
npm install -g n8n

# Install n8n-node CLI (optional but recommended)
npm install -g n8n-node
```

---

## 2. Package Configuration Updates

### 2.1 Update package.json

You need to make the following changes to `Agent700-prod-nodes/package.json`:

#### Required Changes:

1. **Update package name**:
   ```json
   {
     "name": "n8n-nodes-agent700",
     // OR if using scoped package:
     "name": "@agent700/n8n-nodes-agent700"
   }
   ```

2. **Add required keyword**:
   ```json
   {
     "keywords": [
       "n8n",
       "n8n-community-node-package",
       "agent700"
     ]
   }
   ```

3. **Verify n8n configuration**:
   ```json
   {
     "n8n": {
       "n8nNodesApiVersion": 1,
       "nodes": [
         "dist/nodes/Agent700Agent.node.js",
         "dist/nodes/Agent700ContextLibrary.node.js"
       ],
       "credentials": []
     }
   }
   ```
   ✅ Your current configuration includes the two production nodes (Chat and Context Library) and the required credentials.

4. **Remove external dependencies** (if any):
   - n8n requires that community nodes have **no external dependencies** except `n8n-workflow`
   - ✅ **Resolved**: `axios` has been moved to `devDependencies` (for testing only)
   - Production code now uses n8n's built-in `this.helpers.httpRequest()` for HTTP requests
   - Keep only: `"n8n-workflow": "*"` in dependencies

5. **Add repository field** (recommended):
   ```json
   {
     "repository": {
       "type": "git",
       "url": "https://github.com/Agent700-ai/Agent700-n8n.git"
     }
   }
   ```

6. **Add author and license**:
   ```json
   {
     "author": "Your Name <your.email@example.com>",
     "license": "MIT"
   }
   ```

### 2.2 Pre-Submission Checklist

Before proceeding, verify:

- [ ] Package name follows `n8n-nodes-*` or `@scope/n8n-nodes-*` pattern
- [ ] Keyword `n8n-community-node-package` is present
- [ ] `n8n` section correctly lists all nodes and credentials
- [ ] No external dependencies (except `n8n-workflow`)
- [ ] Version follows semantic versioning (e.g., `1.0.0`)
- [ ] Repository URL is set (if applicable)
- [ ] Author and license information is complete

---

## 3. Code Quality & Standards

### 3.1 Linting Requirements

n8n requires that your code passes linting checks. Add linting scripts to `package.json`:

```json
{
  "scripts": {
    "build": "tsc",
    "lint": "eslint src --ext .ts",
    "lintfix": "eslint src --ext .ts --fix",
    "test": "jest"
  }
}
```

**Run linting**:
```bash
npm run lint
```

**Auto-fix issues** (when possible):
```bash
npm run lintfix
```

### 3.2 Code Structure Compliance

Ensure your nodes follow n8n's standards:

- ✅ Each node implements `INodeType` interface
- ✅ Proper error handling using `NodeApiError` or `NodeOperationError`
- ✅ Credentials are properly defined and referenced
- ✅ Node descriptions include all required fields:
  - `displayName`
  - `name`
  - `group`
  - `version`
  - `description`
  - `defaults`
  - `inputs`
  - `outputs`
  - `properties`

### 3.3 Testing Requirements

While not strictly required, having tests improves your chances of approval:

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

**Testing Checklist**:
- [ ] All nodes can be instantiated
- [ ] Credentials are properly validated
- [ ] Error cases are handled gracefully
- [ ] Output data structure is correct

---

## 4. Documentation Requirements

### 4.1 README.md Structure

Create a comprehensive `README.md` in your package root with:

1. **Title and Description**
   ```markdown
   # n8n-nodes-agent700
   
   Agent700 integration for n8n workflow automation.
   ```

2. **Installation Instructions**
   ```markdown
   ## Installation
   
   Install the package in your n8n instance:
   
   ```bash
   npm install n8n-nodes-agent700
   ```
   ```

3. **Authentication Setup**
   ```markdown
   ## Credentials
   
   To use these nodes, you need to configure Agent700 API credentials:
   
   1. Go to n8n Settings > Credentials
   2. Add "Agent700 CLI API" credentials
   3. Enter your API key and base URL
   ```

4. **Node Descriptions**
   - List each node with a brief description
   - Include parameter explanations
   - Show example configurations

5. **Usage Examples**
   ```markdown
   ## Example Workflows
   
   ### Basic Chat Workflow
   [Describe a simple workflow example]
   ```

6. **Links**
   - Link to Agent700 API documentation
   - Link to n8n documentation
   - Link to your repository

### 4.2 Documentation Checklist

- [ ] README.md exists and is comprehensive
- [ ] Installation instructions are clear
- [ ] Authentication setup is documented
- [ ] Each node is described
- [ ] Example workflows are provided
- [ ] Links to external resources are included

---

## 5. Build & Test Process

### Run before submitting

Run this single command locally before submitting a PR or publishing to the Creator Portal:

```bash
npm run check
```

This runs **build → lint → test** in sequence and stops on the first failure. It satisfies the TDD rule: do not merge code without passing all tests (see `.cursor/rules/tdd.mdc`).

For full TDD compliance (including coverage thresholds), run:

```bash
npm run check:ci
```

This adds coverage enforcement (80% branches/functions/lines/statements) per the project's Code Coverage and Quality Gates rules.

> **Note:** For non-trivial changes, the project's SDD rules (`.cursor/rules/sdd/RULE.md`) also require a spec and referencing it in the PR. See those rules for the full pre-submit checklist.

### 5.1 Build Your Package

```bash
# Build TypeScript to JavaScript
npm run build

# Verify dist/ folder contains all compiled files
ls -la dist/
```

**Verify build output**:
- [ ] All `.node.js` files are in `dist/nodes/`
- [ ] All `.credentials.js` files are in `dist/credentials/`
- [ ] SVG icons are copied (if using `file:` icons)
- [ ] No TypeScript source files in `dist/`

### 5.2 Test Locally with n8n

Before publishing, test your nodes locally:

```bash
# Link your package globally
npm link

# In your n8n installation directory, link the package
cd ~/.n8n  # or your n8n directory
npm link n8n-nodes-agent700

# Start n8n
n8n start
```

**Local Testing Checklist**:
- [ ] All nodes appear in n8n UI
- [ ] Node icons display correctly
- [ ] Credentials can be created and saved
- [ ] Each node operation works as expected
- [ ] Error messages are clear and helpful
- [ ] Output data structure matches expectations

### 5.3 Pre-Submission Verification

Run this complete checklist before submitting:

- [ ] **Run `npm run check`** (build, lint, test) and fix any failures
- [ ] For full TDD compliance (including coverage thresholds), run `npm run check:ci`
- [ ] Nodes work in local n8n instance
- [ ] README.md is complete
- [ ] Package name follows convention
- [ ] Required keywords are present
- [ ] No external dependencies (except `n8n-workflow`)
- [ ] Version is set correctly
- [ ] All files are committed to git (if using)

---

## 6. Publishing to npm

### 6.1 Prepare for Publishing

1. **Login to npm**:
   ```bash
   npm login
   ```
   Enter your npm username, password, and email.

2. **Verify you're logged in**:
   ```bash
   npm whoami
   ```

3. **Check package name availability**:
   ```bash
   npm view n8n-nodes-agent700
   ```
   If it returns 404, the name is available. If it returns package info, the name is taken.

### 6.2 Version Management

Use semantic versioning:

- **Patch** (1.0.0 → 1.0.1): Bug fixes
- **Minor** (1.0.0 → 1.1.0): New features, backward compatible
- **Major** (1.0.0 → 2.0.0): Breaking changes

Update version in `package.json`:
```json
{
  "version": "1.0.0"
}
```

### 6.3 Publish to npm

**For unscoped packages**:
```bash
npm publish
```

**For scoped packages** (e.g., `@agent700/n8n-nodes-agent700`):
```bash
npm publish --access public
```

**Important Notes**:
- ⚠️ Package names on npm are permanent. Choose carefully.
- ⚠️ Once published, you cannot unpublish after 72 hours (npm policy).
- ⚠️ Test thoroughly before publishing.

### 6.4 Verify Publication

After publishing, verify:

```bash
# Check package exists
npm view n8n-nodes-agent700

# Install and test
npm install -g n8n-nodes-agent700
```

---

## 7. Submission via Creator Portal

### 7.1 Access Creator Portal

1. Go to [n8n.io/creator-portal](https://n8n.io/creator-portal)
2. Sign up or log in with your n8n account
3. Navigate to "Submit Node" or "My Nodes"

### 7.2 Submission Form

Fill out the submission form with:

1. **Package Name**: `n8n-nodes-agent700` (or your scoped name)
2. **npm Package URL**: `https://www.npmjs.com/package/n8n-nodes-agent700`
3. **Description**: Brief description of what your nodes do
4. **Repository URL**: Link to your GitHub repository (if applicable)
5. **Documentation URL**: Link to your README or documentation
6. **Category**: Select appropriate category (e.g., "AI/ML", "Communication")
7. **Tags**: Add relevant tags (e.g., "agent700", "ai", "chat")

### 7.3 Additional Information

You may be asked for:

- **Use Cases**: Describe common use cases for your nodes
- **Example Workflows**: Provide links to example workflows
- **API Documentation**: Link to Agent700 API documentation
- **Support Information**: How users can get help

### 7.4 Submit

Review all information carefully, then submit your node for review.

**What to Expect**:
- You'll receive a confirmation email
- Your submission will be queued for review
- Review typically takes 1-2 weeks (may vary)

---

## 8. Verification Process

### 8.1 Review Timeline

- **Initial Review**: 1-2 weeks
- **Feedback/Revisions**: Additional 1-2 weeks if changes needed
- **Final Approval**: Varies

### 8.2 What n8n Reviews

n8n's verification team checks:

- ✅ Package naming and structure compliance
- ✅ Code quality and security
- ✅ Documentation completeness
- ✅ Functionality and usability
- ✅ No conflicts with n8n paid features
- ✅ Proper error handling
- ✅ Node descriptions and UX

### 8.3 Common Rejection Reasons

**Package Issues**:
- ❌ Package name doesn't follow convention
- ❌ Missing required keywords
- ❌ External dependencies present
- ❌ Incorrect `n8n` configuration

**Code Issues**:
- ❌ Linting errors
- ❌ Security vulnerabilities
- ❌ Poor error handling
- ❌ Missing required node fields

**Documentation Issues**:
- ❌ Incomplete README
- ❌ Missing authentication instructions
- ❌ No usage examples

**Policy Issues**:
- ❌ Conflicts with n8n enterprise features
- ❌ Violates n8n's terms of service
- ❌ Inappropriate content

### 8.4 Addressing Feedback

If n8n requests changes:

1. **Read feedback carefully**: Understand what needs to be fixed
2. **Make required changes**: Update code, documentation, or configuration
3. **Test thoroughly**: Ensure changes don't break functionality
4. **Update version**: Bump version number in `package.json`
5. **Republish to npm**: `npm publish` (with new version)
6. **Resubmit or update**: Follow n8n's instructions for resubmission

---

## 9. Post-Approval

### 9.1 Node Availability

Once approved:

- ✅ Your nodes will be available in n8n's community nodes
- ✅ Users can install via: `npm install n8n-nodes-agent700`
- ✅ Nodes appear in n8n UI under community nodes
- ✅ Your package will be listed on n8n's community nodes page

### 9.2 Update Process

To update your nodes:

1. **Make changes** to your code
2. **Update version** in `package.json` (semantic versioning)
3. **Rebuild**: `npm run build`
4. **Test locally**: Verify changes work
5. **Publish**: `npm publish` (with new version)
6. **Notify n8n** (if major changes): Update via Creator Portal

### 9.3 Maintenance Responsibilities

As a node maintainer, you should:

- ✅ Respond to issues and bug reports
- ✅ Keep dependencies updated (especially `n8n-workflow`)
- ✅ Maintain compatibility with n8n versions
- ✅ Update documentation as needed
- ✅ Consider user feedback for improvements

---

## 10. Troubleshooting

### 10.1 Common Issues

#### Issue: Package name already taken

**Solution**:
- Use a scoped package: `@your-org/n8n-nodes-agent700`
- Or choose a different name: `n8n-nodes-agent700-cli`

#### Issue: Linting errors

**Solution**:
```bash
# Auto-fix what can be fixed
npm run lintfix

# Manually fix remaining issues
# Check ESLint documentation for specific rules
```

#### Issue: External dependency required (e.g., axios)

**Solution**:
- **Preferred**: Use n8n's built-in HTTP capabilities
- **Alternative**: Contact n8n team to request exception (rarely granted)
- **Workaround**: Bundle dependency (not recommended, may be rejected)

#### Issue: Nodes don't appear in n8n

**Check**:
- ✅ Package is installed: `npm list n8n-nodes-agent700`
- ✅ `n8n` section in `package.json` is correct
- ✅ File paths in `n8n.nodes` array are correct
- ✅ Files exist in `dist/` folder
- ✅ Restart n8n after installation

#### Issue: Credentials not working

**Check**:
- ✅ Credential class implements `ICredentialType`
- ✅ Credential is listed in node's `credentials` array
- ✅ Credential file path is correct in `package.json`
- ✅ Credential properties are properly defined

### 10.2 Getting Help

If you encounter issues:

1. **n8n Documentation**: [docs.n8n.io](https://docs.n8n.io)
2. **n8n Community Forum**: [community.n8n.io](https://community.n8n.io)
3. **n8n Discord**: Join the n8n Discord server
4. **GitHub Issues**: Check n8n-nodes-starter repository
5. **Creator Portal Support**: Contact via Creator Portal

### 10.3 Pre-Submission Checklist Summary

Before submitting, ensure:

**Package Configuration**:
- [ ] Name follows `n8n-nodes-*` or `@scope/n8n-nodes-*`
- [ ] Keyword `n8n-community-node-package` is present
- [ ] `n8n` section correctly configured
- [ ] No external dependencies (except `n8n-workflow`)
- [ ] Version is set correctly

**Code Quality**:
- [ ] **Run `npm run check`** (build, lint, test) and fix any failures
- [ ] For full TDD compliance (including coverage thresholds), run `npm run check:ci`
- [ ] Error handling is proper
- [ ] Node descriptions are complete

**Documentation**:
- [ ] README.md is comprehensive
- [ ] Installation instructions included
- [ ] Authentication setup documented
- [ ] Example workflows provided

**Testing**:
- [ ] Nodes work in local n8n instance
- [ ] All operations tested
- [ ] Error cases handled

**Publishing**:
- [ ] Published to npm
- [ ] Package is accessible
- [ ] Version is correct

**Submission**:
- [ ] Creator Portal account created
- [ ] Submission form completed
- [ ] All required information provided

---

## Quick Reference

### Essential Commands

```bash
# Build
npm run build

# Lint
npm run lint
npm run lintfix

# Test
npm test

# Publish
npm login
npm publish
# OR for scoped packages:
npm publish --access public

# Test locally
npm link
# Then in n8n directory:
npm link n8n-nodes-agent700
n8n start
```

### Important Links

- **n8n Documentation**: https://docs.n8n.io/integrations/creating-nodes/
- **n8n Creator Portal**: https://n8n.io/creator-portal
- **Verification Guidelines**: https://docs.n8n.io/integrations/creating-nodes/build/reference/verification-guidelines/
- **Submit Community Nodes**: https://docs.n8n.io/integrations/creating-nodes/deploy/submit-community-nodes/
- **npm Registry**: https://www.npmjs.com

### Current Package Status

Based on your current `package.json`:

✅ **Good**:
- `n8n` configuration section is correct
- Node and credential paths are properly listed
- License is set (MIT)
- Axios removed from runtime dependencies (only `n8n-workflow` remains)
- Cleaned up to include only production nodes (Chat and Context Library)

⚠️ **Needs Updates** (for submission):
- Package name: `agent700-prod-nodes` → `n8n-nodes-agent700` (or scoped)
- Keywords: Change `n8n-community-node` → `n8n-community-node-package`
- Add lint scripts (`lint` and `lintfix`)
- Add repository and author fields

---

## Next Steps

1. **Update package.json** with correct naming and keywords
2. **Resolve dependency issues** (axios)
3. **Create comprehensive README.md**
4. **Test locally** with n8n
5. **Publish to npm**
6. **Submit via Creator Portal**

Good luck with your submission! 🚀


