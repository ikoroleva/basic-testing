import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.mock('lodash', () => {
  const original = jest.requireActual('lodash');
  return {
    ...original,
    throttle: jest.fn((fn) => fn),
  };
});

describe('throttledGetDataFromApi', () => {
  const mockGet = jest.fn();
  const mockCreate = axios.create as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockCreate.mockReturnValue({
      get: mockGet,
    });
  });

  test('should create instance with provided base url', async () => {
    mockGet.mockResolvedValue({ data: 'response-data' });

    await throttledGetDataFromApi('/posts/1');

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    mockGet.mockResolvedValue({ data: 'ok' });

    await throttledGetDataFromApi('/todos/42');

    expect(mockGet).toHaveBeenCalledWith('/todos/42');
  });

  test('should return response data', async () => {
    const expectedData = { title: 'hello' };
    mockGet.mockResolvedValue({ data: expectedData });

    const result = await throttledGetDataFromApi('/mock-url');

    expect(result).toEqual(expectedData);
  });
});
