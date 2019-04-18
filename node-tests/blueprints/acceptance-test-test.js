'use strict';

const fs = require('fs-extra');

const { beforeEach, describe, it } = require('mocha');
const {
    emberGenerateDestroy,
    emberNew,
    setupTestHooks,
} = require('ember-cli-blueprint-test-helpers/helpers');
const { expect } = require('ember-cli-blueprint-test-helpers/chai');
const linkBlueprints = require('./helpers/link-blueprints');

describe('Acceptance: ember-osf-web generate and destroy acceptance-test', function() {
    setupTestHooks(this);

    beforeEach(() => emberNew()
        .then(linkBlueprints)
        .then(() => {
            fs.writeFileSync(
                '.ember-cli',
                `{
                "disableAnalytics": false,
                "usePods": true
                }`,
            );
        }));
    it('acceptance-test foo', () => emberGenerateDestroy(['acceptance-test', 'foo'], _file => {
        expect(_file('tests/acceptance/foo-test.ts')).to.contain('setupOSFApplicationTest');
    }));
});
