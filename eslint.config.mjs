import { config } from '@n8n/node-cli/eslint';

export default [
	...config,
	{
		ignores: ['tests/**/*', 'jest.config.js', '**/*.test.ts', '**/*.spec.ts'],
	},
];
