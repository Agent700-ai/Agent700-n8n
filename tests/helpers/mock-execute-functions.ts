import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

export interface MockExecuteFunctionsOptions {
  parameters?: Record<string, any>;
  credentials?: Record<string, any>;
  inputData?: INodeExecutionData[];
  workflowStaticData?: Record<string, any>;
  continueOnFail?: boolean;
}

// Type for httpRequest mock options
export interface HttpRequestMockOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  body?: any;
  headers?: Record<string, string>;
  timeout?: number;
  skipSslCertificateValidation?: boolean;
  returnFullResponse?: boolean;
}

export function createMockExecuteFunctions(options: MockExecuteFunctionsOptions = {}): Partial<IExecuteFunctions> & { helpers: { httpRequest: jest.Mock } } {
  const {
    parameters = {},
    credentials = {},
    inputData = [],
    workflowStaticData = {},
    continueOnFail = false,
  } = options;

  // Create mock httpRequest function
  const mockHttpRequest = jest.fn();

  return {
    getNodeParameter: (name: string, itemIndex: number = 0) => {
      return parameters[name];
    },
    getCredentials: async (name: string) => {
      return credentials[name] || null;
    },
    getInputData: () => {
      return inputData.length > 0 ? inputData : [{ json: {} }];
    },
    getWorkflowStaticData: (type: 'global' | 'node') => {
      return workflowStaticData;
    },
    continueOnFail: () => continueOnFail,
    getNode: () => ({
      id: 'test-node-id',
      name: 'Test Node',
      type: 'test',
      typeVersion: 1,
      position: [0, 0],
      parameters: {},
    }),
    helpers: {
      httpRequest: mockHttpRequest,
    },
  } as Partial<IExecuteFunctions> & { helpers: { httpRequest: jest.Mock } };
}

// Helper function to create mock responses for httpRequest
export function createMockHttpResponse(data: any, statusCode: number = 200) {
  return {
    body: data,
    statusCode,
    headers: {},
  };
}



