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

function checkComponentFiles(file, root) {
    expect(file(`${root}/components/foo-bar/component.ts`))
        .to.contain('@localClassNames(\'FooBar\')\nexport default class FooBar extends Component');
    expect(file(`${root}/components/foo-bar/template.hbs`))
        .to.contain('{{yield}}');
    expect(file(`${root}/components/foo-bar/styles.scss`))
        .to.contain('.FooBar {\n}');
}

describe('Acceptance: ember generate and destroy component', function() {
    setupTestHooks(this);

    beforeEach(function() {
        setupPodConfig({ usePods: true });
    });

    it('component foo-bar', function() {
        const args = ['component', 'foo-bar'];

        return emberNew()
            .then(() => fs.symlinkSync(`${__dirname}/../../blueprints`, `${process.cwd()}/blueprints`))
            .then(() => emberGenerateDestroy(args, file => checkComponentFiles(file, 'app')));
    });

    it('addon component foo-bar', function() {
        const args = ['component', 'foo-bar'];

        return emberNew({ target: 'addon' })
            .then(() => fs.symlinkSync(`${__dirname}/../../blueprints`, `${process.cwd()}/blueprints`))
            .then(() => emberGenerateDestroy(args, file => {
                checkComponentFiles(file, 'addon');
                expect(file('addon/components/foo-bar/component.ts'))
                    .to.contain('import styles from \'./styles\';\nimport layout from \'./template\';\n');
                expect(file('addon/components/foo-bar/component.ts'))
                    .to.contain('    layout = layout;\n    styles = styles;\n');
            }));
    });
});
