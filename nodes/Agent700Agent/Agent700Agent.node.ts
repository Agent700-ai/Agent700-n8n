import {
	ApplicationError,
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeParameterResourceLocator,
	INodeType,
	INodeTypeDescription,
	NodeApiError,
} from 'n8n-workflow';

async function loginWithAppPassword(
	httpRequest: IExecuteFunctions['helpers']['httpRequest'],
	baseUrl: string,
	appPassword: string,
): Promise<string> {
	const res = await httpRequest({
		method: 'POST',
		url: `${baseUrl.replace(/\/$/, '')}/api/auth/app-login`,
		body: { token: appPassword },
		headers: {
			'Content-Type': 'application/json',
			'User-Agent': 'A700cli/1.0.0',
		},
	});
	const accessToken = (res as { accessToken?: string })?.accessToken;
	if (!accessToken) {
		throw new ApplicationError('App login did not return accessToken');
	}
	return accessToken;
}

export class Agent700Agent implements INodeType {
	description: INodeTypeDescription = {
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
			// Resource/Operation
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
						description:
							'Send a message to an agent. Uses POST /api/chat with messages[]. Optionally include an Agent ID.',
					},
				],
				default: 'sendMessage',
			},

			// Parameters
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
				description:
					'Whether to return a simplified version of the response instead of the raw data. Simplified output includes response, finish_reason, scrubbed_message, error (plus tokens if present).',
				displayOptions: { show: { resource: ['chat'], operation: ['sendMessage'] } },
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		// Get credentials once per execution
		const credentials = await this.getCredentials('agent700AppPasswordApi');
		const baseUrl = credentials.baseUrl as string;
		const appPassword = credentials.appPassword as string;

		// Login once per execution
		const accessToken = await loginWithAppPassword(this.helpers.httpRequest, baseUrl, appPassword);

		const continueOnFail = this.continueOnFail();

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				if (resource === 'chat' && operation === 'sendMessage') {
					const agentLocator = this.getNodeParameter('agentId', i) as INodeParameterResourceLocator;
					const agentId = (agentLocator?.value as string) || undefined;

					const message = this.getNodeParameter('message', i) as string;
					if (!message?.trim()) {
						throw new NodeApiError(this.getNode(), {
							message:
								`[Item ${i + 1}] Chat:Send Message — 'Message' is required. How to solve: Provide a non-empty message.`,
						});
					}
					const simplify = this.getNodeParameter('simplify', i) as boolean;

					const body: IDataObject = {
						messages: [{ role: 'user', content: message }],
					};
					if (agentId) body.agentId = agentId;

					const res = await this.helpers.httpRequest({
						method: 'POST',
						url: `${baseUrl.replace(/\/$/, '')}/api/chat`,
						headers: { Authorization: `Bearer ${accessToken}` },
						body,
					});

					// API schema (per MCP docs): { response, finish_reason?, scrubbed_message?, error? }
					let out: IDataObject;
					if (simplify) {
						out = {
							response: res?.response,
							finish_reason: res?.finish_reason ?? null,
							scrubbed_message: res?.scrubbed_message ?? null,
							error: res?.error ?? null,
							// include tokens if provided by server
							prompt_tokens: res?.prompt_tokens,
							completion_tokens: res?.completion_tokens,
						};
					} else {
						out = res as IDataObject;
					}

					returnData.push({ json: out, pairedItem: { item: i } });
				} else {
					throw new NodeApiError(this.getNode(), {
						message: `[Item ${i + 1}] Unsupported selection. Check resource/operation.`,
					});
				}
			} catch (error) {
				if (continueOnFail) {
					// Add error info to the item instead of throwing
					const errorMessage =
						error instanceof NodeApiError
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

				// Re-throw if continueOnFail is false
				if (error instanceof NodeApiError) throw error;
				const errorMessage = error instanceof Error ? error.message : String(error);
				throw new NodeApiError(this.getNode(), {
					message: `[Item ${i + 1}] Chat:Send Message — ${errorMessage}. How to solve: Check your App Password and ensure the Agent ID is valid if provided.`,
				});
			}
		}

		return [returnData];
	}
}

// Export for n8n directory loading
export default Agent700Agent;


