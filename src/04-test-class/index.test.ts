import {
  getBankAccount,
  TransferFailedError,
  // SynchronizationFailedError,
  InsufficientFundsError,
  // BankAccount,
} from '.';
import * as lodash from 'lodash';

jest.mock('lodash', () => ({
  random: jest.fn(),
}));

describe('BankAccount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create account with initial balance', () => {
    const account = getBankAccount(100);
    expect(account.getBalance()).toBe(100);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const account = getBankAccount(50);
    expect(() => account.withdraw(100)).toThrow(InsufficientFundsError);
    expect(() => account.withdraw(100)).toThrow(
      'Insufficient funds: cannot withdraw more than 50',
    );
  });

  test('should throw error when transferring more than balance', () => {
    const from = getBankAccount(30);
    const to = getBankAccount(50);
    expect(() => from.transfer(100, to)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    const account = getBankAccount(100);
    expect(() => account.transfer(10, account)).toThrow(TransferFailedError);
    expect(() => account.transfer(10, account)).toThrow('Transfer failed');
  });

  test('should deposit money', () => {
    const account = getBankAccount(100);
    account.deposit(50);
    expect(account.getBalance()).toBe(150);
  });

  test('should withdraw money', () => {
    const account = getBankAccount(100);
    account.withdraw(40);
    expect(account.getBalance()).toBe(60);
  });

  test('should transfer money', () => {
    const from = getBankAccount(200);
    const to = getBankAccount(50);
    from.transfer(75, to);
    expect(from.getBalance()).toBe(125);
    expect(to.getBalance()).toBe(125);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    (lodash.random as jest.Mock)
      .mockReturnValueOnce(42)
      .mockReturnValueOnce(1);

    const account = getBankAccount(0);
    const balance = await account.fetchBalance();
    expect(balance).toBe(42);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    (lodash.random as jest.Mock)
      .mockReturnValueOnce(88)
      .mockReturnValueOnce(1);

    const account = getBankAccount(0);
    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(88);
  });

  /* test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    (lodash.random as jest.Mock)
      .mockReturnValueOnce(77)
      .mockReturnValueOnce(0);

    const account = getBankAccount(0);
    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
    await expect(account.synchronizeBalance()).rejects.toThrow(
      'Synchronization failed',
    );
  }); */
});
