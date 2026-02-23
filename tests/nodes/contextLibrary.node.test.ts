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
      mockExecuteFunctions.helpers.httpRequestWithAuthentication
        .mockResolvedValueOnce({ key1: 'value1', key2: 'value2' });

      const result = await Agent700ContextLibrary.prototype.execute.call(mockExecuteFunctions);

      expect(result[0]).toHaveLength(1);
      expect(result[0][0].json).toEqual({ key1: 'value1', key2: 'value2' });
    });

    it('should call httpRequestWithAuthentication with credential name (FR5)', async () => {
      mockExecuteFunctions.helpers.httpRequestWithAuthentication
        .mockResolvedValueOnce({ key1: 'value1' });

      await Agent700ContextLibrary.prototype.execute.call(mockExecuteFunctions);

      const call = mockExecuteFunctions.helpers.httpRequestWithAuthentication.mock.calls[0];
      expect(call[0]).toBe('agent700AppPasswordApi');
      expect(call[1].method).toBe('GET');
      expect(call[1].url).toContain('/api/alignment-data');
    });

    it('should not set Authorization header manually (FR4)', async () => {
      mockExecuteFunctions.helpers.httpRequestWithAuthentication
        .mockResolvedValueOnce({ key1: 'value1' });

      await Agent700ContextLibrary.prototype.execute.call(mockExecuteFunctions);

      const call = mockExecuteFunctions.helpers.httpRequestWithAuthentication.mock.calls[0];
      expect(call[1].headers?.Authorization).toBeUndefined();
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

      mockExecuteFunctions.helpers.httpRequestWithAuthentication
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

      mockExecuteFunctions.helpers.httpRequestWithAuthentication
        .mockResolvedValueOnce({ success: true });

      const result = await Agent700ContextLibrary.prototype.execute.call(mockExecuteFunctions);

      expect(result[0][0].json.success).toBe(true);
      const createCall = mockExecuteFunctions.helpers.httpRequestWithAuthentication.mock.calls[0];
      expect(createCall[1].body.key).toBe('test-key');
      expect(createCall[1].body.value).toEqual({ data: 'test-value' });
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

      mockExecuteFunctions.helpers.httpRequestWithAuthentication
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

      mockExecuteFunctions.helpers.httpRequestWithAuthentication
        .mockResolvedValueOnce({ success: true });

      const result = await Agent700ContextLibrary.prototype.execute.call(mockExecuteFunctions);

      expect(result[0][0].json.success).toBe(true);
      const updateCall = mockExecuteFunctions.helpers.httpRequestWithAuthentication.mock.calls[0];
      expect(updateCall[1].body.newKey).toBeUndefined();
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

      mockExecuteFunctions.helpers.httpRequestWithAuthentication
        .mockResolvedValueOnce({ success: true });

      const result = await Agent700ContextLibrary.prototype.execute.call(mockExecuteFunctions);

      expect(result[0][0].json.success).toBe(true);
      const updateCall = mockExecuteFunctions.helpers.httpRequestWithAuthentication.mock.calls[0];
      expect(updateCall[1].body.newKey).toBe('new-key');
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

      mockExecuteFunctions.helpers.httpRequestWithAuthentication
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

      mockExecuteFunctions.helpers.httpRequestWithAuthentication
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

      mockExecuteFunctions.helpers.httpRequestWithAuthentication
        .mockResolvedValueOnce([{ key: 'user_1', value: 'value1' }]);

      const result = await Agent700ContextLibrary.prototype.execute.call(mockExecuteFunctions);

      expect(result[0]).toHaveLength(1);
      expect(result[0][0].json).toEqual({ key: 'user_1', value: 'value1' });
    });

    it('should handle errors', async () => {
      mockExecuteFunctions.helpers.httpRequestWithAuthentication
        .mockRejectedValueOnce(new Error('API Error'));

      await expect(
        Agent700ContextLibrary.prototype.execute.call(mockExecuteFunctions)
      ).rejects.toThrow();
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

      mockExecuteFunctions.helpers.httpRequestWithAuthentication
        .mockResolvedValueOnce('test-value');

      await Agent700ContextLibrary.prototype.execute.call(mockExecuteFunctions);

      const getCall = mockExecuteFunctions.helpers.httpRequestWithAuthentication.mock.calls[0];
      expect(getCall[1].url).toContain(encodeURIComponent('key with spaces & special chars'));
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

      mockExecuteFunctions.helpers.httpRequestWithAuthentication
        .mockResolvedValueOnce({ key1: 'value1' })
        .mockResolvedValueOnce({ key2: 'value2' });

      const result = await Agent700ContextLibrary.prototype.execute.call(mockExecuteFunctions);

      expect(result[0]).toHaveLength(2);
    });

    it('should handle array response from getMany', async () => {
      mockExecuteFunctions.helpers.httpRequestWithAuthentication
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

      mockExecuteFunctions.helpers.httpRequestWithAuthentication
        .mockResolvedValueOnce([
          { key: 'test_1', value: 'value1' },
          { key: 'test_2', value: 'value2' },
        ]);

      const result = await Agent700ContextLibrary.prototype.execute.call(mockExecuteFunctions);

      expect(result[0]).toHaveLength(2);
    });

    it('should not use httpRequest directly for API calls (FR4)', async () => {
      mockExecuteFunctions.helpers.httpRequestWithAuthentication
        .mockResolvedValueOnce({ key1: 'value1' });

      await Agent700ContextLibrary.prototype.execute.call(mockExecuteFunctions);

      expect(mockExecuteFunctions.helpers.httpRequest).not.toHaveBeenCalled();
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
