const { describe, it } = require('mocha');
const { expect } = require('ember-cli-blueprint-test-helpers/chai');
const blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');

const { emberGenerateDestroy, emberNew, setupTestHooks } = blueprintHelpers;

describe('Acceptance: ember generate and destroy acceptance-test', function() {
    setupTestHooks(this);

    it('acceptance-test foo', function() {
        const args = ['acceptance-test', 'foo'];

        // pass any additional command line options in the arguments array
        return emberNew()
            .then(() => emberGenerateDestroy(args, file => {
                expect(file('tests/acceptance/foo.ts')).to.contain('setupOSFApplicationTest');
            }));
    });
});
