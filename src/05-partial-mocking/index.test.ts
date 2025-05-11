import { mockOne, mockTwo, mockThree, unmockedFunction } from './index';

jest.mock('./index', () => {
  const originalModule =
    jest.requireActual<typeof import('./index')>('./index');
  return {
    ...originalModule,
    mockOne: jest.fn(),
    mockTwo: jest.fn(),
    mockThree: jest.fn(),
  };
});

describe('partial mocking', () => {
  const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

  afterAll(() => {
    jest.unmock('./index');
    consoleSpy.mockRestore();
  });

  beforeEach(() => {
    consoleSpy.mockClear();
  });

  test('mockOne, mockTwo, mockThree should not log into console', () => {
    mockOne();
    mockTwo();
    mockThree();
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  test('unmockedFunction should log into console', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    unmockedFunction();
    expect(consoleSpy).toHaveBeenCalledWith('I am not mocked');
  });
});
