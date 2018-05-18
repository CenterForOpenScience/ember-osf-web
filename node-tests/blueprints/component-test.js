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

describe('Acceptance: ember generate and destroy component', function() {
    setupTestHooks(this);

    beforeEach(function() {
        setupPodConfig({ usePods: true });
    });

    it('component foo-bar', function() {
        const args = ['component', 'foo-bar'];

        return emberNew()
            .then(() => fs.symlinkSync(`${__dirname}/../../blueprints`, `${process.cwd()}/blueprints`))
            .then(() => emberGenerateDestroy(args, file => {
                expect(file('app/components/foo-bar/component.ts'))
                    .to.contain('export default class FooBar extends Component');
            }));
    });

    it('addon component foo-bar', function() {
        const args = ['component', 'foo-bar'];

        return emberNew({ target: 'addon' })
            .then(() => fs.symlinkSync(`${__dirname}/../../blueprints`, `${process.cwd()}/blueprints`))
            .then(() => emberGenerateDestroy(args, file => {
                expect(file('addon/components/foo-bar/component.ts'))
                    .to.contain(`// @ts-ignore: Ignore import of compiled styles
import styles from './styles';
// @ts-ignore: Ignore import of compiled template
import layout from './template';\n`);
                expect(file('addon/components/foo-bar/component.ts'))
                    .to.contain('styles = styles;');
                expect(file('addon/components/foo-bar/component.ts'))
                    .to.contain('layout = layout;');
            }));
    });
});
