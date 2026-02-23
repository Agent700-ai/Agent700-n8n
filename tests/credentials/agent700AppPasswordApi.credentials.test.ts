import { Agent700AppPasswordApi } from '../../credentials/Agent700AppPasswordApi.credentials';

describe('Agent700AppPasswordApi Credentials', () => {
	let credentials: Agent700AppPasswordApi;

	beforeEach(() => {
		credentials = new Agent700AppPasswordApi();
	});

	describe('credential definition', () => {
		it('should have correct name', () => {
			expect(credentials.name).toBe('agent700AppPasswordApi');
		});

		it('should have correct displayName', () => {
			expect(credentials.displayName).toBe('Agent700 App Password API');
		});

		it('should have documentation URL', () => {
			expect(credentials.documentationUrl).toBe('https://docs.agent700.ai/integrations/n8n');
		});
	});

	describe('properties', () => {
		it('should have baseUrl property', () => {
			const baseUrlProp = credentials.properties.find(p => p.name === 'baseUrl');
			expect(baseUrlProp).toBeDefined();
			expect(baseUrlProp?.type).toBe('string');
			expect(baseUrlProp?.default).toBe('https://api.agent700.ai');
			expect(baseUrlProp?.required).toBe(true);
		});

		it('should have appPassword property', () => {
			const appPasswordProp = credentials.properties.find(p => p.name === 'appPassword');
			expect(appPasswordProp).toBeDefined();
			expect(appPasswordProp?.type).toBe('string');
			expect(appPasswordProp?.default).toBe('');
			expect(appPasswordProp?.required).toBe(true);
		});

		it('should mask appPassword as password field', () => {
			const appPasswordProp = credentials.properties.find(p => p.name === 'appPassword');
			expect(appPasswordProp?.typeOptions?.password).toBe(true);
		});

		it('should have exactly 3 properties (baseUrl, appPassword, sessionToken)', () => {
			expect(credentials.properties).toHaveLength(3);
		});

		it('should have hidden expirable sessionToken property (FR1)', () => {
			const sessionTokenProp = credentials.properties.find(p => p.name === 'sessionToken');
			expect(sessionTokenProp).toBeDefined();
			expect(sessionTokenProp?.type).toBe('hidden');
			expect(sessionTokenProp?.typeOptions?.expirable).toBe(true);
			expect(sessionTokenProp?.default).toBe('');
		});
	});

	describe('preAuthentication (FR2)', () => {
		it('should have preAuthentication method', () => {
			expect(typeof (credentials as any).preAuthentication).toBe('function');
		});
	});

	describe('authenticate (FR3)', () => {
		it('should have authenticate property with Bearer header', () => {
			const auth = (credentials as any).authenticate;
			expect(auth).toBeDefined();
			expect(auth.type).toBe('generic');
			expect(auth.properties.headers.Authorization).toBe(
				'=Bearer {{$credentials.sessionToken}}',
			);
		});
	});

	describe('test request', () => {
		it('should have test request configuration', () => {
			expect(credentials.test).toBeDefined();
			expect(credentials.test.request).toBeDefined();
		});

		it('should use app-login endpoint for test', () => {
			expect(credentials.test.request.url).toContain('/api/auth/app-login');
		});
	});
});



