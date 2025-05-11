import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import { join } from 'path';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';

jest.mock('fs');
jest.mock('fs/promises');
jest.mock('path', () => ({
  join: jest.fn(),
}));

describe('doStuffByTimeout', () => {
  let timeoutSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    timeoutSpy = jest.spyOn(global, 'setTimeout');
  });

  afterEach(() => {
    jest.useRealTimers();
    timeoutSpy.mockRestore();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 1000);
    expect(timeoutSpy).toHaveBeenCalledWith(callback, 1000);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 2000);

    jest.advanceTimersByTime(1999);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  let intervalSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    intervalSpy = jest.spyOn(global, 'setInterval');
  });

  afterEach(() => {
    jest.useRealTimers();
    intervalSpy.mockRestore();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 500);
    expect(intervalSpy).toHaveBeenCalledWith(callback, 500);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 1000);

    jest.advanceTimersByTime(3000);
    expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  const mockJoin = join as jest.Mock;
  const mockExistsSync = fs.existsSync as jest.Mock;
  const mockReadFile = fsPromises.readFile as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call join with pathToFile', async () => {
    mockJoin.mockReturnValue('/mocked/path');
    mockExistsSync.mockReturnValue(false);

    await readFileAsynchronously('someFile.txt');
    expect(mockJoin).toHaveBeenCalledWith(__dirname, 'someFile.txt');
  });

  test('should return null if file does not exist', async () => {
    mockJoin.mockReturnValue('/nonexistent/file');
    mockExistsSync.mockReturnValue(false);

    const result = await readFileAsynchronously('missing.txt');
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    mockJoin.mockReturnValue('/mocked/path');
    mockExistsSync.mockReturnValue(true);
    mockReadFile.mockResolvedValue(Buffer.from('File content'));

    const result = await readFileAsynchronously('existing.txt');
    expect(mockReadFile).toHaveBeenCalledWith('/mocked/path');
    expect(result).toBe('File content');
  });
});
