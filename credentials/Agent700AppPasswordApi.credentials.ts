import type {
	IAuthenticateGeneric,
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	IHttpRequestHelper,
	INodeProperties,
	Icon,
} from 'n8n-workflow';

export class Agent700AppPasswordApi implements ICredentialType {
	name = 'agent700AppPasswordApi';
	displayName = 'Agent700 App Password API';
	icon: Icon = 'file:../nodes/Agent700Agent/Agent700.svg';
	documentationUrl = 'https://docs.agent700.ai/integrations/n8n';
	properties: INodeProperties[] = [
		{
			displayName: 'Session Token',
			name: 'sessionToken',
			type: 'hidden',
			typeOptions: {
				expirable: true,
				password: true,
			},
			default: '',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.agent700.ai',
			description: 'Base URL of Agent700 API',
			required: true,
		},
		{
			displayName: 'App Password',
			name: 'appPassword',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Agent700 App Password (format app_a7_ + 32 chars). Used to obtain an access token.',
			required: true,
		},
	];

	async preAuthentication(this: IHttpRequestHelper, credentials: ICredentialDataDecryptedObject) {
		const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');
		const { accessToken } = (await this.helpers.httpRequest({
			method: 'POST',
			url: `${baseUrl}/api/auth/app-login`,
			body: { token: credentials.appPassword },
			headers: {
				'Content-Type': 'application/json',
				'User-Agent': 'A700cli/1.0.0',
			},
		})) as { accessToken: string };
		return { sessionToken: accessToken };
	}

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.sessionToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			method: 'POST',
			url: '={{$credentials.baseUrl}}/api/auth/app-login',
			body: {
				token: '={{$credentials.appPassword}}',
			},
			headers: {
				'Content-Type': 'application/json',
				'User-Agent': 'A700cli/1.0.0',
			},
		},
	};
}


