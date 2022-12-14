import { defineFeature, loadFeature } from 'jest-cucumber';
import * as assert from 'node:assert';
import {
  givenAlreadyRegistered,
  givenDidNotLogInBefore,
  givenUserLoggedInBefore,
  whenLoggingInWithCorrectCreds,
} from 'specs/step-definitions/auth/login-common';
import {
  thenLoginErrorIsReturned,
  whenLogsInWithWrongPassword,
  whenLogsInWithWrongUsername,
} from 'specs/step-definitions/auth/login-failure';
import { thenLoginIsSuccessful } from 'specs/step-definitions/auth/login-success';
import { removeAllData } from 'specs/step-definitions/hooks';
import { initTestResponseObject } from 'specs/step-definitions/step-definition.utils';
import { testData } from 'specs/step-definitions/test-data';

const feature = loadFeature('./specs/features/login.feature');

let sessionCookie = `sessionId=${testData.correctCreds.sessionId}`;

defineFeature(feature, (test) => {
  beforeEach(async () => {
    await removeAllData();
  });

  afterAll(async () => {
    await removeAllData();
  });

  test('Successful login - first time', async ({ given, when, then }) => {
    givenAlreadyRegistered(given);

    givenDidNotLogInBefore(given);

    const loginResult = {
      responseCookie: undefined,
      responseStatus: undefined,
    };

    whenLoggingInWithCorrectCreds(when, sessionCookie, loginResult);

    then('they get a generated session cookie', function () {
      const [key, value] = loginResult.responseCookie?.split('=');

      assert.strictEqual(key, 'sessionId');

      // the cookie is a uuidv4
      assert.strictEqual(value.split('-').length - 1, 4);
    });

    thenLoginIsSuccessful(then, loginResult);
  });

  test('Successful login - subsequent times', ({ given, when, then }) => {
    givenAlreadyRegistered(given);

    givenUserLoggedInBefore(given, sessionCookie);

    const loginResult = {
      responseCookie: undefined,
      responseStatus: undefined,
    };

    whenLoggingInWithCorrectCreds(when, sessionCookie, loginResult);

    then('they get their session cookie back', function () {
      const [key, value] = loginResult.responseCookie.split('=');

      assert.strictEqual(key, 'sessionId');
      assert.strictEqual(
        value.split(';')[0],
        testData.correctCreds.sessionId,
      );
    });

    thenLoginIsSuccessful(then, loginResult);
  });

  test('Unsuccessful login - wrong username', ({ given, when, then }) => {
    givenAlreadyRegistered(given);

    givenDidNotLogInBefore(given);

    const loginResult = initTestResponseObject();

    whenLogsInWithWrongUsername(when, loginResult);

    thenLoginErrorIsReturned(then, loginResult);
  });

  test('Unsuccessful login - wrong password', ({ given, when, then }) => {
    givenAlreadyRegistered(given);

    givenDidNotLogInBefore(given);

    const loginResult = initTestResponseObject();

    whenLogsInWithWrongPassword(when, loginResult);

    thenLoginErrorIsReturned(then, loginResult);
  });
});
