---
alwaysApply: true
---

# n8n Custom Nodes – Cursor Project Rules

**Goal:** When generating or modifying code in this repository, behave as an experienced n8n node developer. Ensure all custom nodes and credentials **fully comply with n8n’s specifications and best practices** for structure, security, UX, and maintainability.

These rules apply whenever you work on:

- Custom n8n **nodes** (`*.node.ts` / `*.node.js`).
- Custom n8n **credentials** (`*.credentials.ts` / `*.credentials.js`).
- Shared **generic functions** and helpers used by nodes (`GenericFunctions.ts`, etc.).
- Node-related **documentation** (Markdown, descriptions, examples).

---

## 1. General Node Structure

When creating or editing a node:

1. **File & Class**
   - One node per file, named: `XYZ.node.ts`.
   - Export a single class that implements `INodeType`:
     ```ts
     import type { INodeType, INodeTypeDescription } from 'n8n-workflow';

     export class Xyz implements INodeType {
       description: INodeTypeDescription = { /* ... */ };

       async execute(this: IExecuteFunctions) {
         // ...
       }
     }
     ```
   - Use named export; class name should match node `name`/`displayName` logically.

2. **Required Fields in `description`**
   - `displayName` (user-facing, readable).
   - `name` (internal id, kebabCase/camelCase, unique).
   - `icon` or `iconUrl` (use `file:xyz.svg` where appropriate).
   - `group` (usually `['transform']`, `['output']`, `['input']`, `['organization']`, etc. as per n8n conventions).
   - `version` (number or array, e.g., `1` or `[1, 2]`).
   - `description` (short, clear summary).
   - `defaults` (e.g., `{ name: 'XYZ' }`).
   - `inputs` (e.g., `['main']`).
   - `outputs` (e.g., `['main']`).
   - `credentials` (if needed).
   - `properties` (parameters, operations, options, etc.).

3. **Consistency**
   - Ensure `name`, `displayName`, `icon`, and folder location are consistent.
   - No hard-coded environment-specific values (URLs, tokens, etc.).

---

## 2. Description & Properties (Node Parameters)

Design node parameters according to n8n specs:

1. **General Rules**
   - All parameters go in `description.properties`.
   - Use correct `type`: `string`, `number`, `boolean`, `options`, `collection`, `fixedCollection`, `multiOptions`, `dateTime`, etc.
   - Every parameter must have:
     - `displayName`
     - `name`
     - `type`
     - `default`
   - Add `description` where not trivial.

2. **Operations & Resources Pattern**
   - For multi-operation nodes, follow the **Resource / Operation** pattern:
     ```ts
     {
       displayName: 'Resource',
       name: 'resource',
       type: 'options',
       options: [
         { name: 'Contact', value: 'contact' },
         { name: 'Deal', value: 'deal' },
       ],
       default: 'contact',
     },
     {
       displayName: 'Operation',
       name: 'operation',
       type: 'options',
       displayOptions: {
         show: { resource: ['contact'] },
       },
       options: [
         { name: 'Create', value: 'create' },
         { name: 'Get', value: 'get' },
       ],
       default: 'create',
     }
     ```
   - Use `displayOptions.show` and `displayOptions.hide` to conditionally display fields based on `resource` and `operation`.

3. **Collections & FixedCollections**
   - Use `collection` for simple, optional grouped fields.
   - Use `fixedCollection` when multiple variant sets or multiple values are needed (e.g. query params, headers).
   - Each option inside must define `values`.

4. **Load Options**
   - For dynamic dropdowns (e.g., fetching projects, boards, custom fields):
     - Use `typeOptions.loadOptionsMethod` and implement `loadOptions` in the same node class using `ILoadOptionsFunctions`.
     - Example:
       ```ts
       {
         displayName: 'Project',
         name: 'projectId',
         type: 'options',
         typeOptions: {
           loadOptionsMethod: 'getProjects',
         },
         default: '',
       }
       ```
       ```ts
       methods = {
         loadOptions: {
           async getProjects(this: ILoadOptionsFunctions) {
             // return array of { name, value }
           },
         },
       };
       ```

5. **Validation & Type Options**
   - Use `typeOptions` to set:
     - `minValue`, `maxValue`
     - `multipleValues`, `multipleValueButtonText`
     - `rows`, `alwaysOpenEditWindow` (where appropriate).
   - Mark required parameters explicitly (`required: true`) when essential.

---

## 3. Credentials & Security

When working with credentials or authenticated nodes:

1. **Credential Definitions**
   - Define credentials in `*.credentials.ts` implementing `ICredentialType`:
     ```ts
     import type { ICredentialType, INodeProperties } from 'n8n-workflow';

     export class XyzApi implements ICredentialType {
       name = 'xyzApi';
       displayName = 'XYZ API';
       properties: INodeProperties[] = [
         {
           displayName: 'API Key',
           name: 'apiKey',
           type: 'string',
           typeOptions: { password: true },
           default: '',
         },
       ];
     }
     ```
   - Never hard-code secrets or tokens.

2. **Referencing Credentials in Nodes**
   - Use `credentials` in the node `description`:
     ```ts
     credentials: [
       {
         name: 'xyzApi',
         required: true,
       },
     ],
     ```
   - Retrieve credentials via:
     ```ts
     const credentials = await this.getCredentials('xyzApi');
     ```

3. **Security Best Practices**
   - Use `NodeApiRequest` or shared generic request wrappers that respect:
     - Base URL configuration.
     - Authentication headers.
     - Error handling and retries if defined.
   - Do **not** log sensitive data (tokens, passwords, full payloads with secrets).

---

## 4. Execution Logic (`execute()`)

Implement node logic according to n8n’s execution conventions:

1. **Signature**
   - Use correct context-typed signature:
     ```ts
     async execute(this: IExecuteFunctions) {
       const items = this.getInputData();
       const returnData: INodeExecutionData[] = [];

       // Loop over items if needed
       for (let i = 0; i < items.length; i++) {
         // ...
       }

       return [returnData];
     }
     ```

2. **Item Handling**
   - n8n passes items as array; **always handle multiple input items** unless node is explicitly single-item.
   - Maintain `itemIndex` when needed for error reporting or mapping.

3. **Return Format**
   - Always return `Array<Array<INodeExecutionData>>`:
     - Typically one output, so `return [returnData];`
   - For JSON data:
     ```ts
     returnData.push({ json: responseData });
     ```
   - For binary data:
     - Use `NodeExecutionWithMetadata` shape: `{ json: {}, binary: { data: { /* ... */ } } }`.

4. **Resource/Operation Switching**
   - Use `resource` and `operation` values from parameters:
     ```ts
     const resource = this.getNodeParameter('resource', 0) as string;
     const operation = this.getNodeParameter('operation', 0) as string;

     if (resource === 'contact') {
       if (operation === 'create') {
         // ...
       }
     }
     ```

5. **No Heavy Logic in Description**
   - Keep all logic inside `execute()` (or helper methods), **not** in `description`.

---

## 5. HTTP Requests & Generic Functions

When making HTTP requests:

1. **Use n8n Helpers**
   - Prefer using `NodeApiRequest` or shared helper functions (e.g., `apiRequest`, `apiRequestAllItems`) in `GenericFunctions.ts`.
   - Respect:
     - Authentication from credentials.
     - Base URL config.
     - Pagination when applicable.

2. **Pagination**
   - If API supports pagination and node offers “Return All”:
     - Provide `returnAll` boolean parameter.
     - Implement proper pagination, collecting all items when `returnAll` is true.
     - Also support `limit` when not returning all.

3. **Error Handling on Requests**
   - Catch errors and wrap them in `NodeApiError` or `NodeOperationError` with meaningful messages.
   - Avoid throwing raw errors from HTTP client.

---

## 6. Error Handling & Partial Failures

When dealing with errors:

1. **Consistent Exceptions**
   - Use:
     ```ts
     import { NodeApiError, NodeOperationError } from 'n8n-workflow';

     throw new NodeApiError(this.getNode(), error);
     ```
     or
     ```ts
     throw new NodeOperationError(this.getNode(), 'Descriptive error message');
     ```

2. **Per-Item Error Handling**
   - If appropriate, support **continue on fail** semantics by checking:
     ```ts
     const continueOnFail = this.continueOnFail();
     ```
   - For failed items:
     - Add error info to the item instead of stopping the whole execution when `continueOnFail` is enabled.

3. **Clear Messages**
   - Error messages should be clear and helpful.
   - Do not expose secrets or entire raw payloads in error messages.

---

## 7. Data Shape & UX Expectations

1. **Consistent JSON Shape**
   - Shape returned data to match API semantics but:
     - Flatten or normalize where it greatly improves UX.
   - For lists, return arrays under a meaningful key or as an array of items, not deeply nested unreadable structures.

2. **Parameter UX**
   - Use meaningful `displayName`.
   - Use `hint` or `description` where needed to clarify usage.
   - Avoid overwhelming users: group advanced/uncommon options under `collection` or `fixedCollection` labeled “Additional Fields”, “Options”, etc.

3. **Defaults**
   - Provide sensible `default` values for all parameters.
   - Do not default to destructive behavior (e.g., delete, truncate, etc.).

---

## 8. Versioning & Compatibility

1. **Versions**
   - Use numeric `version` (`1`, `2`, etc.).
   - For breaking changes, introduce a new version:
     - Either as `version: 2` in a single class with `routing` or version-specific logic, or
     - As multiple classes/implementations if pattern requires.

2. **Backward Compatibility**
   - Avoid breaking existing workflows:
     - When adding new required fields, provide safe default values.
     - When changing data shape, consider new parameters (e.g., `simple` vs `raw` output).

3. **Deprecation**
   - If functionality is deprecated, make it explicit in `description` or parameter descriptions.

---

## 9. Documentation & Metadata

1. **Node Description**
   - `description` should explain what the node does in a single sentence.
   - If needed, use extended in-UI docs (longer `description`, parameter help texts).

2. **Examples**
   - Where appropriate, include short hints or examples in parameter descriptions.
   - Example: “Use comma-separated values for multiple tags.”

3. **External Docs**
   - Add links to official API docs or relevant resources in descriptions where helpful.

---

## 10. Testing & Quality

1. **Manual Testing**
   - Ensure the node:
     - Displays parameters correctly according to `displayOptions`.
     - Works with multiple input items.
     - Handles credentials and unauthorized errors gracefully.

2. **Automated Tests (If Present)**
   - Follow existing project structure for node tests.
   - Add tests for:
     - Parameter handling.
     - Basic API calls.
     - Error conditions where possible.

3. **Lint & Style**
   - Follow the project’s TypeScript/JavaScript style (ESLint/Prettier).
   - No unused imports or dead code.

---

## 11. Default Assistant Behavior (Cursor)

By default, when asked to create or modify an n8n node or credentials:

1. **Create/Update:**
   - A fully valid `INodeType` implementation with:
     - Correct `description` structure.
     - Proper `properties` and `displayOptions`.
     - Correct `execute()` implementation for multi-item handling.
   - If credentials are needed, also create/update `ICredentialType`.

2. **Ensure Compliance:**
   - Check that all **required description fields** are present.
   - Parameters have correct `type`, `default`, and `description`/`displayName`.
   - HTTP requests go through shared helpers or follow n8n patterns.
   - Errors use `NodeApiError` or `NodeOperationError`.

3. **Explain When Needed (Comments or Docs):**
   - Briefly comment complex logic or unusual behavior.
   - Keep comments accurate and minimal.

If the user requests a “quick sketch” or “minimal example,” you may provide a simplified node, but should still:

- Keep the **core structure valid**.
- Mention what would be needed to make it production-ready (e.g. credentials, error handling, pagination).

Always favor **spec-compliant, secure, and user-friendly n8n nodes** over ad-hoc or shortcut implementations.