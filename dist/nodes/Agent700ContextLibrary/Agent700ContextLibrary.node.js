"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agent700ContextLibrary = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class Agent700ContextLibrary {
    constructor() {
        this.description = {
            displayName: 'Agent700 Context Library',
            name: 'agent700ContextLibrary',
            icon: 'file:Agent700.svg',
            group: ['transform'],
            version: 3,
            description: 'Store and retrieve key/value alignment data for agents',
            defaults: { name: 'Agent700 Context Library' },
            inputs: ['main'],
            outputs: ['main'],
            usableAsTool: true,
            credentials: [
                {
                    name: 'agent700AppPasswordApi',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [{ name: 'Entry', value: 'entry' }],
                    default: 'entry',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: { show: { resource: ['entry'] } },
                    options: [
                        {
                            name: 'Create',
                            value: 'create',
                            action: 'Create entry',
                            description: 'Create a new entry',
                        },
                        {
                            name: 'Create or Update',
                            value: 'upsert',
                            action: 'Create or update entry',
                            description: 'Create a new record, or update the current one if it already exists (upsert)',
                        },
                        {
                            name: 'Delete',
                            value: 'delete',
                            action: 'Delete entry',
                            description: 'Delete an entry permanently',
                        },
                        {
                            name: 'Get',
                            value: 'get',
                            action: 'Get entry by key',
                            description: 'Retrieve a single entry by its key',
                        },
                        {
                            name: 'Get Many',
                            value: 'getMany',
                            action: 'List entries',
                            description: 'Retrieve all entries',
                        },
                        {
                            name: 'Query',
                            value: 'query',
                            action: 'List key value pairs by pattern',
                            description: 'Retrieve entries matching a pattern',
                        },
                        {
                            name: 'Query + Construct',
                            value: 'queryConstruct',
                            action: 'Construct JSON from pattern matches',
                            description: 'Construct JSON from entries matching a pattern using a template',
                        },
                        {
                            name: 'Update',
                            value: 'update',
                            action: 'Update entry rename optional',
                            description: 'Update an existing entry, optionally renaming the key',
                        },
                    ],
                    default: 'get',
                },
                {
                    displayName: 'Key',
                    name: 'key',
                    type: 'string',
                    default: '',
                    placeholder: 'e.g. links.PrivacyPolicies',
                    required: true,
                    displayOptions: {
                        show: { resource: ['entry'], operation: ['get', 'create', 'update', 'upsert', 'delete'] },
                    },
                    description: 'The key to retrieve, create, update, or delete',
                },
                {
                    displayName: 'Value',
                    name: 'value',
                    type: 'json',
                    default: '{}',
                    placeholder: 'e.g. {"value":"https://a.com, https://b.com"}',
                    displayOptions: { show: { resource: ['entry'], operation: ['create', 'update', 'upsert'] } },
                    description: 'Any JSON-serializable data (server stores as alignment data value)',
                },
                {
                    displayName: 'New Key',
                    name: 'newKey',
                    type: 'string',
                    typeOptions: { password: true },
                    default: '',
                    placeholder: 'e.g. links.NewPrivacyPolicies',
                    displayOptions: { show: { resource: ['entry'], operation: ['update'] } },
                    description: 'Optional: rename the key while updating',
                },
                {
                    displayName: 'Pattern',
                    name: 'pattern',
                    type: 'string',
                    default: '',
                    required: true,
                    placeholder: 'e.g. links.*',
                    displayOptions: { show: { resource: ['entry'], operation: ['query', 'queryConstruct'] } },
                    description: 'Pattern for matching keys. Syntax per server (e.g., glob or regex). Example: links.*',
                },
                {
                    displayName: 'Construct Template',
                    name: 'template',
                    type: 'string',
                    typeOptions: { rows: 4 },
                    default: '{"key":"{{key}}","value":"{{value}}"}',
                    displayOptions: { show: { resource: ['entry'], operation: ['queryConstruct'] } },
                    description: 'Template string used to construct JSON; placeholders: {{key}}, {{value}}',
                },
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const credentials = await this.getCredentials('agent700AppPasswordApi');
        const baseUrl = credentials.baseUrl.replace(/\/$/, '');
        const api = async (method, path, body) => {
            return this.helpers.httpRequestWithAuthentication.call(this, 'agent700AppPasswordApi', {
                method,
                url: `${baseUrl}${path}`,
                body,
            });
        };
        const continueOnFail = this.continueOnFail();
        for (let i = 0; i < items.length; i++) {
            try {
                const resource = this.getNodeParameter('resource', i);
                const operation = this.getNodeParameter('operation', i);
                if (resource !== 'entry') {
                    throw new n8n_workflow_1.NodeApiError(this.getNode(), {
                        message: `[Item ${i + 1}] Unsupported resource. How to solve: Select 'Entry' as the resource.`,
                    });
                }
                if (operation === 'get') {
                    const key = this.getNodeParameter('key', i);
                    if (!key) {
                        throw new n8n_workflow_1.NodeApiError(this.getNode(), {
                            message: `[Item ${i + 1}] Entry:Get — 'Key' is required. How to solve: Provide a key to retrieve.`,
                        });
                    }
                    const res = await api('GET', `/api/alignment-data/by-key/${encodeURIComponent(key)}`);
                    returnData.push({ json: res, pairedItem: { item: i } });
                }
                else if (operation === 'getMany') {
                    const res = await api('GET', `/api/alignment-data`);
                    if (Array.isArray(res))
                        returnData.push(...res.map((r) => ({ json: r, pairedItem: { item: i } })));
                    else
                        returnData.push({ json: res, pairedItem: { item: i } });
                }
                else if (operation === 'create') {
                    const key = this.getNodeParameter('key', i);
                    const value = this.getNodeParameter('value', i);
                    if (!key) {
                        throw new n8n_workflow_1.NodeApiError(this.getNode(), {
                            message: `[Item ${i + 1}] Entry:Create — 'Key' is required. How to solve: Provide a key for the new entry.`,
                        });
                    }
                    const res = await api('POST', `/api/alignment-data`, { key, value });
                    returnData.push({ json: res, pairedItem: { item: i } });
                }
                else if (operation === 'update') {
                    const key = this.getNodeParameter('key', i);
                    const value = this.getNodeParameter('value', i);
                    const newKey = this.getNodeParameter('newKey', i);
                    if (!key) {
                        throw new n8n_workflow_1.NodeApiError(this.getNode(), {
                            message: `[Item ${i + 1}] Entry:Update — 'Key' is required. How to solve: Provide the key of the entry to update.`,
                        });
                    }
                    const body = { key, value };
                    if (newKey)
                        body.newKey = newKey;
                    const res = await api('PUT', `/api/alignment-data`, body);
                    returnData.push({ json: res, pairedItem: { item: i } });
                }
                else if (operation === 'upsert') {
                    const key = this.getNodeParameter('key', i);
                    const value = this.getNodeParameter('value', i);
                    if (!key) {
                        throw new n8n_workflow_1.NodeApiError(this.getNode(), {
                            message: `[Item ${i + 1}] Entry:Upsert — 'Key' is required. How to solve: Provide a key for the entry.`,
                        });
                    }
                    const res = await api('POST', `/api/alignment-data`, { key, value });
                    returnData.push({ json: res, pairedItem: { item: i } });
                }
                else if (operation === 'delete') {
                    const key = this.getNodeParameter('key', i);
                    if (!key) {
                        throw new n8n_workflow_1.NodeApiError(this.getNode(), {
                            message: `[Item ${i + 1}] Entry:Delete — 'Key' is required. How to solve: Provide the key of the entry to delete.`,
                        });
                    }
                    await api('DELETE', `/api/alignment-data/${encodeURIComponent(key)}`);
                    returnData.push({ json: { deleted: true, key }, pairedItem: { item: i } });
                }
                else if (operation === 'query') {
                    const pattern = this.getNodeParameter('pattern', i);
                    if (!pattern) {
                        throw new n8n_workflow_1.NodeApiError(this.getNode(), {
                            message: `[Item ${i + 1}] Entry:Query — 'Pattern' is required. How to solve: Provide a pattern to match keys (e.g., links.*).`,
                        });
                    }
                    const res = await api('GET', `/api/alignment-data/by-pattern/${encodeURIComponent(pattern)}`);
                    returnData.push({ json: { pattern, result: res }, pairedItem: { item: i } });
                }
                else if (operation === 'queryConstruct') {
                    const pattern = this.getNodeParameter('pattern', i);
                    const template = this.getNodeParameter('template', i);
                    if (!pattern) {
                        throw new n8n_workflow_1.NodeApiError(this.getNode(), {
                            message: `[Item ${i + 1}] Entry:Query + Construct — 'Pattern' is required. How to solve: Provide a pattern to match keys (e.g., links.*).`,
                        });
                    }
                    const res = await api('GET', `/api/alignment-data/by-pattern/${encodeURIComponent(pattern)}/construct-json?template=${encodeURIComponent(template)}`);
                    if (Array.isArray(res))
                        returnData.push(...res.map((r) => ({ json: r, pairedItem: { item: i } })));
                    else
                        returnData.push({ json: res, pairedItem: { item: i } });
                }
                else {
                    throw new n8n_workflow_1.NodeApiError(this.getNode(), {
                        message: `[Item ${i + 1}] Entry:${operation} — Unsupported operation. How to solve: Select a valid operation from the list.`,
                    });
                }
            }
            catch (error) {
                if (continueOnFail) {
                    const errorMessage = error instanceof n8n_workflow_1.NodeApiError
                        ? error.message
                        : error instanceof Error
                            ? error.message
                            : String(error);
                    returnData.push({
                        json: {
                            error: errorMessage,
                            itemIndex: i + 1,
                            operation: this.getNodeParameter('operation', i),
                        },
                        pairedItem: { item: i },
                    });
                    continue;
                }
                if (error instanceof n8n_workflow_1.NodeApiError)
                    throw error;
                const errorMessage = error instanceof Error ? error.message : String(error);
                throw new n8n_workflow_1.NodeApiError(this.getNode(), {
                    message: `[Item ${i + 1}] Entry:${this.getNodeParameter('operation', i)} — ${errorMessage}. How to solve: Check required parameters and ensure your App Password is valid.`,
                });
            }
        }
        return [returnData];
    }
}
exports.Agent700ContextLibrary = Agent700ContextLibrary;
exports.default = Agent700ContextLibrary;
//# sourceMappingURL=Agent700ContextLibrary.node.js.map