"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agent700AppPasswordApi = void 0;
class Agent700AppPasswordApi {
    constructor() {
        this.name = 'agent700AppPasswordApi';
        this.displayName = 'Agent700 App Password API';
        this.icon = 'file:../nodes/Agent700Agent/Agent700.svg';
        this.documentationUrl = 'https://docs.agent700.ai/integrations/n8n';
        this.properties = [
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
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    Authorization: '=Bearer {{$credentials.sessionToken}}',
                },
            },
        };
        this.test = {
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
    async preAuthentication(credentials) {
        const baseUrl = credentials.baseUrl.replace(/\/$/, '');
        const { accessToken } = (await this.helpers.httpRequest({
            method: 'POST',
            url: `${baseUrl}/api/auth/app-login`,
            body: { token: credentials.appPassword },
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'A700cli/1.0.0',
            },
        }));
        return { sessionToken: accessToken };
    }
}
exports.Agent700AppPasswordApi = Agent700AppPasswordApi;
//# sourceMappingURL=Agent700AppPasswordApi.credentials.js.map