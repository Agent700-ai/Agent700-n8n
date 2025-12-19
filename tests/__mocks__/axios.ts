const axios = jest.requireActual('axios');

const mockAxios = {
  ...axios,
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn(),
  isAxiosError: (error: any) => {
    return error && error.isAxiosError === true;
  },
};

export default mockAxios;



