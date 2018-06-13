'use strict';

const { beforeEach, describe, it } = require('mocha');
const {
    emberGenerateDestroy,
    emberNew,
    setupPodConfig,
    setupTestHooks,
} = require('ember-cli-blueprint-test-helpers/helpers');
const { expect } = require('ember-cli-blueprint-test-helpers/chai');
const linkBlueprints = require('./helpers/link-blueprints');
const fixture = require('../helpers/fixture');

describe('Blueprint: component-addon', function() {
    setupTestHooks(this);

    describe('generates valid component files', function() {
        beforeEach(function() {
            setupPodConfig({ usePods: true });
            return emberNew({ target: 'addon' }).then(linkBlueprints);
        });

        it('in addon (app tree)', function() {
            return emberGenerateDestroy(['component-addon', 'foo-bar'], file => {
                expect(file('app/components/foo-bar/component.ts'))
                    .to.equal(fixture('blueprints/component-addon/component.ts'));
            });
        });
    });
});
