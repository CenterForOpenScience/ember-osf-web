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

    describe('generates valid component files', () => {
        beforeEach(() => {
            setupPodConfig({ usePods: true });
            return emberNew({ target: 'addon' }).then(linkBlueprints);
        });

        it('in addon (app tree)', () => emberGenerateDestroy(['component-addon', 'foo-bar'], file => {
            expect(file('app/components/foo-bar/component.js'))
                .to.equal(fixture('blueprints/component-addon/component.js'));
        }));
    });
});
