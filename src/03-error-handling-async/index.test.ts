import {
  throwError,
  throwCustomError,
  resolveValue,
  MyAwesomeError,
  rejectCustomError,
} from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    const input = 42;
    await expect(resolveValue(input)).resolves.toBe(42);

    const inputObj = { foo: 'bar' };
    await expect(resolveValue(inputObj)).resolves.toEqual({ foo: 'bar' });

    const inputNull = null;
    await expect(resolveValue(inputNull)).resolves.toBeNull();
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    const msg = 'Custom error message';
    expect(() => throwError(msg)).toThrow(msg);
  });

  test('should throw error with default message if message is not provided', () => {
    expect(() => throwError()).toThrow('Oops!');
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    expect(() => throwCustomError()).toThrow(MyAwesomeError);
    expect(() => throwCustomError()).toThrow(
      'This is my awesome custom error!',
    );
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    await expect(rejectCustomError()).rejects.toThrow(MyAwesomeError);
    await expect(rejectCustomError()).rejects.toThrow(
      'This is my awesome custom error!',
    );
  });
});
