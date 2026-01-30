/**
 * Vitest test setup
 * Configures ESLint's RuleTester to work with Vitest
 */

import { RuleTester } from 'eslint';
import { afterAll, describe, it } from 'vitest';

// Configure RuleTester to work with Vitest
RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;
RuleTester.afterAll = afterAll;
