"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agent700Agent = void 0;
const n8n_workflow_1 = require("n8n-workflow");
async function loginWithAppPassword(httpRequest, baseUrl, appPassword) {
    const res = await httpRequest({
        method: 'POST',
        url: `${baseUrl.replace(/\/$/, '')}/api/auth/app-login`,
        body: { token: appPassword },
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'A700cli/1.0.0',
        },
    });
    const accessToken = res === null || res === void 0 ? void 0 : res.accessToken;
    if (!accessToken) {
        throw new n8n_workflow_1.ApplicationError('App login did not return accessToken');
    }
    return accessToken;
}
class Agent700Agent {
    constructor() {
        this.description = {
            displayName: 'Agent700 Agent',
            name: 'agent700Agent',
            icon: 'file:Agent700.svg',
            group: ['transform'],
            version: 2,
            description: 'Send context to any trusted agent within Agent700 via our API',
            defaults: { name: 'Agent700 Agent' },
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
                    options: [{ name: 'Chat', value: 'chat' }],
                    default: 'chat',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: { show: { resource: ['chat'] } },
                    options: [
                        {
                            name: 'Send Message',
                            value: 'sendMessage',
                            action: 'Send message to agent',
                            description: 'Send a message to an agent. Uses POST /api/chat with messages[]. Optionally include an Agent ID.',
                        },
                    ],
                    default: 'sendMessage',
                },
                {
                    displayName: 'Agent ID',
                    name: 'agentId',
                    type: 'resourceLocator',
                    default: { mode: 'id', value: '' },
                    description: 'Enter the Agent ID to use (optional)',
                    displayOptions: { show: { resource: ['chat'], operation: ['sendMessage'] } },
                    modes: [
                        {
                            displayName: 'ID',
                            name: 'id',
                            type: 'string',
                            placeholder: 'e.g. 550e8400-e29b-41d4-a716-446655440000',
                        },
                    ],
                },
                {
                    displayName: 'Message',
                    name: 'message',
                    type: 'string',
                    typeOptions: { rows: 4 },
                    default: '',
                    required: true,
                    placeholder: 'e.g. Summarize privacy policy at {{ $json.url }}',
                    description: 'User message to send. Will be wrapped into messages[] as a single user role turn.',
                    displayOptions: { show: { resource: ['chat'], operation: ['sendMessage'] } },
                },
                {
                    displayName: 'Simplify',
                    name: 'simplify',
                    type: 'boolean',
                    default: true,
                    description: 'Whether to return a simplified version of the response instead of the raw data. Simplified output includes response, finish_reason, scrubbed_message, error (plus tokens if present).',
                    displayOptions: { show: { resource: ['chat'], operation: ['sendMessage'] } },
                },
            ],
        };
    }
    async execute() {
        var _a, _b, _c;
        const items = this.getInputData();
        const returnData = [];
        const credentials = await this.getCredentials('agent700AppPasswordApi');
        const baseUrl = credentials.baseUrl;
        const appPassword = credentials.appPassword;
        const accessToken = await loginWithAppPassword(this.helpers.httpRequest, baseUrl, appPassword);
        const continueOnFail = this.continueOnFail();
        for (let i = 0; i < items.length; i++) {
            try {
                const resource = this.getNodeParameter('resource', i);
                const operation = this.getNodeParameter('operation', i);
                if (resource === 'chat' && operation === 'sendMessage') {
                    const agentLocator = this.getNodeParameter('agentId', i);
                    const agentId = (agentLocator === null || agentLocator === void 0 ? void 0 : agentLocator.value) || undefined;
                    const message = this.getNodeParameter('message', i);
                    if (!(message === null || message === void 0 ? void 0 : message.trim())) {
                        throw new n8n_workflow_1.NodeApiError(this.getNode(), {
                            message: `[Item ${i + 1}] Chat:Send Message — 'Message' is required. How to solve: Provide a non-empty message.`,
                        });
                    }
                    const simplify = this.getNodeParameter('simplify', i);
                    const body = {
                        messages: [{ role: 'user', content: message }],
                    };
                    if (agentId)
                        body.agentId = agentId;
                    const res = await this.helpers.httpRequest({
                        method: 'POST',
                        url: `${baseUrl.replace(/\/$/, '')}/api/chat`,
                        headers: { Authorization: `Bearer ${accessToken}` },
                        body,
                    });
                    let out;
                    if (simplify) {
                        out = {
                            response: res === null || res === void 0 ? void 0 : res.response,
                            finish_reason: (_a = res === null || res === void 0 ? void 0 : res.finish_reason) !== null && _a !== void 0 ? _a : null,
                            scrubbed_message: (_b = res === null || res === void 0 ? void 0 : res.scrubbed_message) !== null && _b !== void 0 ? _b : null,
                            error: (_c = res === null || res === void 0 ? void 0 : res.error) !== null && _c !== void 0 ? _c : null,
                            prompt_tokens: res === null || res === void 0 ? void 0 : res.prompt_tokens,
                            completion_tokens: res === null || res === void 0 ? void 0 : res.completion_tokens,
                        };
                    }
                    else {
                        out = res;
                    }
                    returnData.push({ json: out, pairedItem: { item: i } });
                }
                else {
                    throw new n8n_workflow_1.NodeApiError(this.getNode(), {
                        message: `[Item ${i + 1}] Unsupported selection. Check resource/operation.`,
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
                        },
                        pairedItem: { item: i },
                    });
                    continue;
                }
                if (error instanceof n8n_workflow_1.NodeApiError)
                    throw error;
                const errorMessage = error instanceof Error ? error.message : String(error);
                throw new n8n_workflow_1.NodeApiError(this.getNode(), {
                    message: `[Item ${i + 1}] Chat:Send Message — ${errorMessage}. How to solve: Check your App Password and ensure the Agent ID is valid if provided.`,
                });
            }
        }
        return [returnData];
    }
}
exports.Agent700Agent = Agent700Agent;
exports.default = Agent700Agent;
//# sourceMappingURL=Agent700Agent.node.js.map