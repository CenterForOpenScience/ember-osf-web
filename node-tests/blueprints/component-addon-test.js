'use strict';

const fs = require('fs');
const { beforeEach, describe, it } = require('mocha');
const {
    emberGenerateDestroy,
    emberNew,
    setupPodConfig,
    setupTestHooks,
} = require('ember-cli-blueprint-test-helpers/helpers');
const { expect } = require('ember-cli-blueprint-test-helpers/chai');

describe('Blueprint: component-addon', function() {
    setupTestHooks(this);

    describe('in addon', function() {
        beforeEach(function() {
            setupPodConfig({ usePods: true });
            return emberNew({ target: 'addon' })
                .then(() => fs.symlinkSync(`${__dirname}/../../blueprints`, `${process.cwd()}/blueprints`));
        });

        it('component-addon foo-bar', function() {
            return emberGenerateDestroy(['component-addon', 'foo-bar'], _file => {
                expect(_file('app/components/foo-bar/component.ts'))
                    .to.contain("export { default } from 'my-addon/components/foo-bar/component';");
            });
        });
    });
});
