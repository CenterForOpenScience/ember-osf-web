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

function checkComponentFiles(file, root) {
    expect(file(`${root}/components/foo-bar/component.ts`))
        .to.equal(fixture(`blueprints/component/in-${root}.ts`));
    expect(file(`${root}/components/foo-bar/template.hbs`))
        .to.equal('{{yield}}');
}

describe('Blueprint: component', function() {
    setupTestHooks(this);

    describe('generates valid component files', () => {
        beforeEach(() => {
            setupPodConfig({ usePods: true });
        });

        it('in app', () => emberNew()
            .then(linkBlueprints)
            .then(() => emberGenerateDestroy(
                ['component', 'foo-bar'],
                file => checkComponentFiles(file, 'app'),
            )));

        it('in addon', () => emberNew({ target: 'addon' })
            .then(linkBlueprints)
            .then(() => emberGenerateDestroy(
                ['component', 'foo-bar'],
                file => checkComponentFiles(file, 'addon'),
            )));
    });
});
