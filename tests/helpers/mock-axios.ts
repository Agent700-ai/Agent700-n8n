import axios from 'axios';

export function createMockAxiosResponse(data: any, status: number = 200) {
  return {
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    data,
    headers: {},
    config: {},
  };
}

export function createMockAxiosError(message: string, status: number = 500, data?: any) {
  const error: any = new Error(message);
  error.isAxiosError = true;
  error.response = {
    status,
    statusText: 'Error',
    data: data || { error: message },
    headers: {},
    config: {},
  };
  error.config = {};
  return error;
}



