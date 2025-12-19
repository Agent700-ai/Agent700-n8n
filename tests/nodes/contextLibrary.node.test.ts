import { Agent700ContextLibrary } from '../../nodes/Agent700ContextLibrary/Agent700ContextLibrary.node';
import { createMockExecuteFunctions } from '../helpers/mock-execute-functions';

describe('Agent700ContextLibrary', () => {
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
        resource: 'entry',
        operation: 'getMany',
      },
    });
  });

  describe('execute', () => {
    it('should get many entries', async () => {
      // Mock authentication and list all
      mockExecuteFunctions.helpers.httpRequest
        .mockResolvedValueOnce({ accessToken: 'test-token' })
        .mockResolvedValueOnce({ key1: 'value1', key2: 'value2' });

      const result = await Agent700ContextLibrary.prototype.execute.call(mockExecuteFunctions);

      expect(result[0]).toHaveLength(1);
      expect(result[0][0].json).toEqual({ key1: 'value1', key2: 'value2' });
    });

    it('should get entry by key', async () => {
      mockExecuteFunctions.getNodeParameter = (name: string) => {
        const params: Record<string, any> = {
          resource: 'entry',
          operation: 'get',
          key: 'test-key',
        };
        return params[name];
      };

      // Mock authentication and get by key
      mockExecuteFunctions.helpers.httpRequest
        .mockResolvedValueOnce({ accessToken: 'test-token' })
        .mockResolvedValueOnce('test-value');

      const result = await Agent700ContextLibrary.prototype.execute.call(mockExecuteFunctions);

      expect(result[0][0].json).toBe('test-value');
    });

    it('should create entry', async () => {
      mockExecuteFunctions.getNodeParameter = (name: string) => {
        const params: Record<string, any> = {
          resource: 'entry',
          operation: 'create',
          key: 'test-key',
          value: { data: 'test-value' },
        };
        return params[name];
      };

      // Mock authentication and create
      mockExecuteFunctions.helpers.httpRequest
        .mockResolvedValueOnce({ accessToken: 'test-token' })
        .mockResolvedValueOnce({ success: true });

      const result = await Agent700ContextLibrary.prototype.execute.call(mockExecuteFunctions);

      expect(result[0][0].json.success).toBe(true);
      const createCall = mockExecuteFunctions.helpers.httpRequest.mock.calls[1];
      expect(createCall[0].body.key).toBe('test-key');
      expect(createCall[0].body.value).toEqual({ data: 'test-value' });
    });

    it('should upsert entry', async () => {
      mockExecuteFunctions.getNodeParameter = (name: string) => {
        const params: Record<string, any> = {
          resource: 'entry',
          operation: 'upsert',
          key: 'test-key',
          value: { data: 'test-value' },
        };
        return params[name];
      };

      // Mock authentication and upsert
      mockExecuteFunctions.helpers.httpRequest
        .mockResolvedValueOnce({ accessToken: 'test-token' })
        .mockResolvedValueOnce({ success: true });

      const result = await Agent700ContextLibrary.prototype.execute.call(mockExecuteFunctions);

      expect(result[0][0].json.success).toBe(true);
    });

    it('should update entry', async () => {
      mockExecuteFunctions.getNodeParameter = (name: string) => {
        const params: Record<string, any> = {
          resource: 'entry',
          operation: 'update',
          key: 'test-key',
          value: { data: 'updated-value' },
          newKey: '',
        };
        return params[name];
      };

      mockExecuteFunctions.helpers.httpRequest
        .mockResolvedValueOnce({ accessToken: 'test-token' })
        .mockResolvedValueOnce({ success: true });

      const result = await Agent700ContextLibrary.prototype.execute.call(mockExecuteFunctions);

      expect(result[0][0].json.success).toBe(true);
      const updateCall = mockExecuteFunctions.helpers.httpRequest.mock.calls[1];
      expect(updateCall[0].body.newKey).toBeUndefined();
    });

    it('should update entry with key renaming', async () => {
      mockExecuteFunctions.getNodeParameter = (name: string) => {
        const params: Record<string, any> = {
          resource: 'entry',
          operation: 'update',
          key: 'old-key',
          newKey: 'new-key',
          value: { data: 'updated-value' },
        };
        return params[name];
      };

      mockExecuteFunctions.helpers.httpRequest
        .mockResolvedValueOnce({ accessToken: 'test-token' })
        .mockResolvedValueOnce({ success: true });

      const result = await Agent700ContextLibrary.prototype.execute.call(mockExecuteFunctions);

      expect(result[0][0].json.success).toBe(true);
      const updateCall = mockExecuteFunctions.helpers.httpRequest.mock.calls[1];
      expect(updateCall[0].body.newKey).toBe('new-key');
    });

    it('should delete entry', async () => {
      mockExecuteFunctions.getNodeParameter = (name: string) => {
        const params: Record<string, any> = {
          resource: 'entry',
          operation: 'delete',
          key: 'test-key',
        };
        return params[name];
      };

      mockExecuteFunctions.helpers.httpRequest
        .mockResolvedValueOnce({ accessToken: 'test-token' })
        .mockResolvedValueOnce({});

      const result = await Agent700ContextLibrary.prototype.execute.call(mockExecuteFunctions);

      expect(result[0][0].json.deleted).toBe(true);
      expect(result[0][0].json.key).toBe('test-key');
    });

    it('should query entries by pattern', async () => {
      mockExecuteFunctions.getNodeParameter = (name: string) => {
        const params: Record<string, any> = {
          resource: 'entry',
          operation: 'query',
          pattern: 'test_*',
        };
        return params[name];
      };

      mockExecuteFunctions.helpers.httpRequest
        .mockResolvedValueOnce({ accessToken: 'test-token' })
        .mockResolvedValueOnce({ test_key1: 'value1', test_key2: 'value2' });

      const result = await Agent700ContextLibrary.prototype.execute.call(mockExecuteFunctions);

      expect(result[0][0].json.pattern).toBe('test_*');
      expect(result[0][0].json.result).toEqual({ test_key1: 'value1', test_key2: 'value2' });
    });

    it('should query and construct JSON from pattern', async () => {
      mockExecuteFunctions.getNodeParameter = (name: string) => {
        const params: Record<string, any> = {
          resource: 'entry',
          operation: 'queryConstruct',
          pattern: 'user_*',
          template: '{"key":"{{key}}","value":"{{value}}"}',
        };
        return params[name];
      };

      mockExecuteFunctions.helpers.httpRequest
        .mockResolvedValueOnce({ accessToken: 'test-token' })
        .mockResolvedValueOnce([{ key: 'user_1', value: 'value1' }]);

      const result = await Agent700ContextLibrary.prototype.execute.call(mockExecuteFunctions);

      expect(result[0]).toHaveLength(1);
      expect(result[0][0].json).toEqual({ key: 'user_1', value: 'value1' });
    });

    it('should handle errors', async () => {
      // Mock authentication failure
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValueOnce(new Error('Auth failed'));

      await expect(
        Agent700ContextLibrary.prototype.execute.call(mockExecuteFunctions)
      ).rejects.toThrow();
    });

    it('should throw ApplicationError when auth response has no accessToken', async () => {
      // Mock authentication returning response without accessToken
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce({});

      await expect(
        Agent700ContextLibrary.prototype.execute.call(mockExecuteFunctions)
      ).rejects.toThrow('App login did not return accessToken');
    });

    it('should throw ApplicationError when auth response accessToken is null', async () => {
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce({ accessToken: null });

      await expect(
        Agent700ContextLibrary.prototype.execute.call(mockExecuteFunctions)
      ).rejects.toThrow('App login did not return accessToken');
    });

    it('should validate required key parameter for get', async () => {
      mockExecuteFunctions.getNodeParameter = (name: string) => {
        const params: Record<string, any> = {
          resource: 'entry',
          operation: 'get',
          key: '',
        };
        return params[name];
      };

      mockExecuteFunctions.helpers.httpRequest
        .mockResolvedValueOnce({ accessToken: 'test-token' });

      await expect(
        Agent700ContextLibrary.prototype.execute.call(mockExecuteFunctions)
      ).rejects.toThrow();
    });

    it('should validate required key parameter for delete', async () => {
      mockExecuteFunctions.getNodeParameter = (name: string) => {
        const params: Record<string, any> = {
          resource: 'entry',
          operation: 'delete',
          key: '',
        };
        return params[name];
      };

      mockExecuteFunctions.helpers.httpRequest
        .mockResolvedValueOnce({ accessToken: 'test-token' });

      await expect(
        Agent700ContextLibrary.prototype.execute.call(mockExecuteFunctions)
      ).rejects.toThrow();
    });

    it('should validate required key parameter for upsert', async () => {
      mockExecuteFunctions.getNodeParameter = (name: string) => {
        const params: Record<string, any> = {
          resource: 'entry',
          operation: 'upsert',
          key: '',
          value: { data: 'test-value' },
        };
        return params[name];
      };

      mockExecuteFunctions.helpers.httpRequest
        .mockResolvedValueOnce({ accessToken: 'test-token' });

      await expect(
        Agent700ContextLibrary.prototype.execute.call(mockExecuteFunctions)
      ).rejects.toThrow();
    });

    it('should validate required pattern for query', async () => {
      mockExecuteFunctions.getNodeParameter = (name: string) => {
        const params: Record<string, any> = {
          resource: 'entry',
          operation: 'query',
          pattern: '',
        };
        return params[name];
      };

      mockExecuteFunctions.helpers.httpRequest
        .mockResolvedValueOnce({ accessToken: 'test-token' });

      await expect(
        Agent700ContextLibrary.prototype.execute.call(mockExecuteFunctions)
      ).rejects.toThrow();
    });

    it('should validate required pattern for queryConstruct', async () => {
      mockExecuteFunctions.getNodeParameter = (name: string) => {
        const params: Record<string, any> = {
          resource: 'entry',
          operation: 'queryConstruct',
          pattern: '',
          template: '{"key":"{{key}}"}',
        };
        return params[name];
      };

      mockExecuteFunctions.helpers.httpRequest
        .mockResolvedValueOnce({ accessToken: 'test-token' });

      await expect(
        Agent700ContextLibrary.prototype.execute.call(mockExecuteFunctions)
      ).rejects.toThrow();
    });

    it('should handle URL encoding for special characters in keys', async () => {
      mockExecuteFunctions.getNodeParameter = (name: string) => {
        const params: Record<string, any> = {
          resource: 'entry',
          operation: 'get',
          key: 'key with spaces & special chars',
        };
        return params[name];
      };

      mockExecuteFunctions.helpers.httpRequest
        .mockResolvedValueOnce({ accessToken: 'test-token' })
        .mockResolvedValueOnce('test-value');

      await Agent700ContextLibrary.prototype.execute.call(mockExecuteFunctions);

      // Verify URL encoding in the request
      const getCall = mockExecuteFunctions.helpers.httpRequest.mock.calls[1];
      expect(getCall[0].url).toContain(encodeURIComponent('key with spaces & special chars'));
    });

    it('should process multiple input items', async () => {
      const inputData = [
        { json: { operation: 'getMany' } },
        { json: { operation: 'getMany' } },
      ];

      mockExecuteFunctions.getInputData = () => inputData;
      mockExecuteFunctions.getNodeParameter = (name: string, itemIndex: number) => {
        const params: Record<string, any> = {
          resource: 'entry',
          operation: inputData[itemIndex].json.operation,
        };
        return params[name];
      };

      mockExecuteFunctions.helpers.httpRequest
        .mockResolvedValueOnce({ accessToken: 'test-token' })
        .mockResolvedValueOnce({ key1: 'value1' })
        .mockResolvedValueOnce({ key2: 'value2' });

      const result = await Agent700ContextLibrary.prototype.execute.call(mockExecuteFunctions);

      expect(result[0]).toHaveLength(2);
    });

    it('should handle array response from getMany', async () => {
      mockExecuteFunctions.helpers.httpRequest
        .mockResolvedValueOnce({ accessToken: 'test-token' })
        .mockResolvedValueOnce([{ key: 'key1', value: 'value1' }, { key: 'key2', value: 'value2' }]);

      const result = await Agent700ContextLibrary.prototype.execute.call(mockExecuteFunctions);

      expect(result[0]).toHaveLength(2);
      expect(result[0][0].json).toEqual({ key: 'key1', value: 'value1' });
      expect(result[0][1].json).toEqual({ key: 'key2', value: 'value2' });
    });

    it('should handle array response from queryConstruct', async () => {
      mockExecuteFunctions.getNodeParameter = (name: string) => {
        const params: Record<string, any> = {
          resource: 'entry',
          operation: 'queryConstruct',
          pattern: 'test_*',
          template: '{"key":"{{key}}"}',
        };
        return params[name];
      };

      mockExecuteFunctions.helpers.httpRequest
        .mockResolvedValueOnce({ accessToken: 'test-token' })
        .mockResolvedValueOnce([
          { key: 'test_1', value: 'value1' },
          { key: 'test_2', value: 'value2' },
        ]);

      const result = await Agent700ContextLibrary.prototype.execute.call(mockExecuteFunctions);

      expect(result[0]).toHaveLength(2);
    });
  });

  describe('node description', () => {
    it('should have Key field without password typeOption', () => {
      const node = new Agent700ContextLibrary();
      const keyProp = node.description.properties.find(p => p.name === 'key');
      expect(keyProp).toBeDefined();
      expect(keyProp?.typeOptions?.password).toBeUndefined();
    });
  });
});
