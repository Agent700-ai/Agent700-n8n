import { Agent700Agent } from '../../nodes/Agent700Agent/Agent700Agent.node';
import { createMockExecuteFunctions } from '../helpers/mock-execute-functions';

describe('Agent700Agent', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockExecuteFunctions = createMockExecuteFunctions({
      credentials: {
        agent700AppPasswordApi: {
          baseUrl: 'https://api.agent700.ai',
          appPassword: 'app_a7_test_password_12345678901234567890',
        },
      },
      parameters: {
        resource: 'chat',
        operation: 'sendMessage',
        agentId: { mode: 'id', value: 'test-agent-uuid' },
        message: 'Test message',
        simplify: true,
      },
    });
  });

  describe('execute', () => {
    it('should send message successfully (AC3)', async () => {
      mockExecuteFunctions.helpers.httpRequestWithAuthentication
        .mockResolvedValueOnce({
          response: 'Test response content',
          finish_reason: 'stop',
        });

      const result = await Agent700Agent.prototype.execute.call(mockExecuteFunctions);

      expect(result[0]).toHaveLength(1);
      expect(result[0][0].json.response).toBe('Test response content');
      expect(result[0][0].json.finish_reason).toBe('stop');
    });

    it('should call httpRequestWithAuthentication with credential name (FR5)', async () => {
      mockExecuteFunctions.helpers.httpRequestWithAuthentication
        .mockResolvedValueOnce({
          response: 'Test response',
          finish_reason: 'stop',
        });

      await Agent700Agent.prototype.execute.call(mockExecuteFunctions);

      const call = mockExecuteFunctions.helpers.httpRequestWithAuthentication.mock.calls[0];
      expect(call[0]).toBe('agent700AppPasswordApi');
      expect(call[1].method).toBe('POST');
      expect(call[1].url).toContain('/api/chat');
    });

    it('should not set Authorization header manually (FR4)', async () => {
      mockExecuteFunctions.helpers.httpRequestWithAuthentication
        .mockResolvedValueOnce({
          response: 'Test response',
          finish_reason: 'stop',
        });

      await Agent700Agent.prototype.execute.call(mockExecuteFunctions);

      const call = mockExecuteFunctions.helpers.httpRequestWithAuthentication.mock.calls[0];
      expect(call[1].headers?.Authorization).toBeUndefined();
    });

    it('should send message without agent ID', async () => {
      mockExecuteFunctions.getNodeParameter = (name: string) => {
        const params: Record<string, any> = {
          resource: 'chat',
          operation: 'sendMessage',
          agentId: undefined,
          message: 'Test message',
          simplify: true,
        };
        return params[name];
      };

      mockExecuteFunctions.helpers.httpRequestWithAuthentication
        .mockResolvedValueOnce({
          response: 'Test response',
          finish_reason: 'stop',
        });

      const result = await Agent700Agent.prototype.execute.call(mockExecuteFunctions);

      expect(result[0]).toHaveLength(1);
      const chatCall = mockExecuteFunctions.helpers.httpRequestWithAuthentication.mock.calls[0];
      expect(chatCall[1].body.agentId).toBeUndefined();
    });

    it('should handle simplify parameter false', async () => {
      mockExecuteFunctions.getNodeParameter = (name: string) => {
        const params: Record<string, any> = {
          resource: 'chat',
          operation: 'sendMessage',
          agentId: { mode: 'id', value: 'test-agent-uuid' },
          message: 'Test message',
          simplify: false,
        };
        return params[name];
      };

      const fullResponse = {
        response: 'Test response',
        finish_reason: 'stop',
        scrubbed_message: 'scrubbed',
        error: null,
        prompt_tokens: 100,
        completion_tokens: 50,
        extra_field: 'extra',
      };

      mockExecuteFunctions.helpers.httpRequestWithAuthentication
        .mockResolvedValueOnce(fullResponse);

      const result = await Agent700Agent.prototype.execute.call(mockExecuteFunctions);

      expect(result[0][0].json).toEqual(fullResponse);
      expect(result[0][0].json.extra_field).toBe('extra');
    });

    it('should handle simplify parameter true', async () => {
      const fullResponse = {
        response: 'Test response',
        finish_reason: 'stop',
        scrubbed_message: 'scrubbed',
        error: null,
        prompt_tokens: 100,
        completion_tokens: 50,
        extra_field: 'extra',
      };

      mockExecuteFunctions.helpers.httpRequestWithAuthentication
        .mockResolvedValueOnce(fullResponse);

      const result = await Agent700Agent.prototype.execute.call(mockExecuteFunctions);

      expect(result[0][0].json.response).toBe('Test response');
      expect(result[0][0].json.finish_reason).toBe('stop');
      expect(result[0][0].json.scrubbed_message).toBe('scrubbed');
      expect(result[0][0].json.error).toBe(null);
      expect(result[0][0].json.prompt_tokens).toBe(100);
      expect(result[0][0].json.completion_tokens).toBe(50);
      expect(result[0][0].json.extra_field).toBeUndefined();
    });

    it('should handle API errors with NodeApiError', async () => {
      mockExecuteFunctions.helpers.httpRequestWithAuthentication
        .mockRejectedValueOnce(new Error('API Error'));

      await expect(
        Agent700Agent.prototype.execute.call(mockExecuteFunctions)
      ).rejects.toThrow();
    });

    it('should validate required message parameter', async () => {
      mockExecuteFunctions.getNodeParameter = (name: string) => {
        const params: Record<string, any> = {
          resource: 'chat',
          operation: 'sendMessage',
          agentId: { mode: 'id', value: 'test-agent-uuid' },
          message: '',
          simplify: true,
        };
        return params[name];
      };

      await expect(
        Agent700Agent.prototype.execute.call(mockExecuteFunctions)
      ).rejects.toThrow();
    });

    it('should handle agent ID from resource locator', async () => {
      mockExecuteFunctions.getNodeParameter = (name: string) => {
        const params: Record<string, any> = {
          resource: 'chat',
          operation: 'sendMessage',
          agentId: { mode: 'list', value: 'selected-agent-id' },
          message: 'Test message',
          simplify: true,
        };
        return params[name];
      };

      mockExecuteFunctions.helpers.httpRequestWithAuthentication
        .mockResolvedValueOnce({
          response: 'Test response',
          finish_reason: 'stop',
        });

      const result = await Agent700Agent.prototype.execute.call(mockExecuteFunctions);

      expect(result[0]).toHaveLength(1);
      const chatCall = mockExecuteFunctions.helpers.httpRequestWithAuthentication.mock.calls[0];
      expect(chatCall[1].body.agentId).toBe('selected-agent-id');
    });

    it('should process multiple input items', async () => {
      const inputData = [
        { json: { message: 'Message 1' } },
        { json: { message: 'Message 2' } },
      ];

      mockExecuteFunctions.getInputData = () => inputData;
      mockExecuteFunctions.getNodeParameter = (name: string, itemIndex: number) => {
        const params: Record<string, any> = {
          resource: 'chat',
          operation: 'sendMessage',
          agentId: { mode: 'id', value: 'test-agent-uuid' },
          message: inputData[itemIndex].json.message,
          simplify: true,
        };
        return params[name];
      };

      mockExecuteFunctions.helpers.httpRequestWithAuthentication
        .mockResolvedValueOnce({ response: 'Response 1', finish_reason: 'stop' })
        .mockResolvedValueOnce({ response: 'Response 2', finish_reason: 'stop' });

      const result = await Agent700Agent.prototype.execute.call(mockExecuteFunctions);

      expect(result[0]).toHaveLength(2);
    });

    it('should handle authentication failures gracefully', async () => {
      mockExecuteFunctions.helpers.httpRequestWithAuthentication
        .mockRejectedValueOnce(new Error('Authentication failed'));

      await expect(
        Agent700Agent.prototype.execute.call(mockExecuteFunctions)
      ).rejects.toThrow();
    });

    it('should include tokens in simplified output when present', async () => {
      mockExecuteFunctions.helpers.httpRequestWithAuthentication
        .mockResolvedValueOnce({
          response: 'Test response',
          finish_reason: 'stop',
          prompt_tokens: 100,
          completion_tokens: 50,
        });

      const result = await Agent700Agent.prototype.execute.call(mockExecuteFunctions);

      expect(result[0][0].json.prompt_tokens).toBe(100);
      expect(result[0][0].json.completion_tokens).toBe(50);
    });

    it('should handle null values in simplified output', async () => {
      mockExecuteFunctions.helpers.httpRequestWithAuthentication
        .mockResolvedValueOnce({
          response: 'Test response',
        });

      const result = await Agent700Agent.prototype.execute.call(mockExecuteFunctions);

      expect(result[0][0].json.finish_reason).toBe(null);
      expect(result[0][0].json.scrubbed_message).toBe(null);
      expect(result[0][0].json.error).toBe(null);
    });

    it('should handle error in response', async () => {
      mockExecuteFunctions.helpers.httpRequestWithAuthentication
        .mockResolvedValueOnce({
          response: null,
          error: 'API error message',
        });

      const result = await Agent700Agent.prototype.execute.call(mockExecuteFunctions);

      expect(result[0][0].json.error).toBe('API error message');
    });

    it('should not use httpRequest directly for API calls (FR4)', async () => {
      mockExecuteFunctions.helpers.httpRequestWithAuthentication
        .mockResolvedValueOnce({
          response: 'Test response',
          finish_reason: 'stop',
        });

      await Agent700Agent.prototype.execute.call(mockExecuteFunctions);

      expect(mockExecuteFunctions.helpers.httpRequest).not.toHaveBeenCalled();
    });
  });
});
