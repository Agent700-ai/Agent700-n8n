import { getRealCredentials, hasRealCredentials } from './env-credentials';

export const testCredentials = {
  agent700AppPasswordApi: {
    baseUrl: 'https://api.agent700.ai',
    appPassword: 'test-app-password',
  },
};

// Get real credentials if available, otherwise use mocked credentials
export function getTestCredentials() {
  const realCreds = getRealCredentials();
  if (realCreds && realCreds.agent700AppPasswordApi.appPassword) {
    return realCreds.agent700AppPasswordApi;
  }
  return testCredentials.agent700AppPasswordApi;
}

export function hasRealTestCredentials(): boolean {
  return hasRealCredentials();
}

export const testAgentConfig = {
  agentRevisionId: 1,
  enableMcp: false,
  mcpServerNames: [],
  model: 'gpt-4o',
  agentName: 'Test Agent',
  masterPrompt: 'Test prompt',
  temperature: 0.7,
  maxTokens: 4000,
  imageDimensions: '1024x1024',
  topP: 1.0,
  scrubPii: false,
  piiThreshold: 0.5,
};

export const testChatResponse = {
  response: 'Test response content',
  finish_reason: 'stop',
  scrubbed_message: 'Test response content',
  tokens: {
    prompt: 10,
    completion: 20,
    total: 30,
  },
  citations: [],
};

export const testAuthResponse = {
  accessToken: 'test-access-token',
  refreshToken: 'test-refresh-token',
};



