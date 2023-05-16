'use strict';

const doc = require('..');
const assert = require('assert').strict;

assert.strictEqual(doc(), 'Hello from doc');
console.info('doc tests passed');
