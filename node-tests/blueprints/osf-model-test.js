'use strict';

const { describe, it } = require('mocha');
const {
    setupTestHooks,
    emberNew,
    emberGenerateDestroy,
} = require('ember-cli-blueprint-test-helpers/helpers');
const { expect } = require('ember-cli-blueprint-test-helpers/chai');

const linkBlueprints = require('./helpers/link-blueprints');
const fixture = require('../helpers/fixture');

function checkOsfModelFiles(file) {
    expect(file('app/models/foo-bar.ts'))
        .to.equal(fixture('blueprints/osf-model/model.ts'));
    expect(file('app/adapters/foo-bar.ts'))
        .to.equal(fixture('blueprints/osf-model/adapter.ts'));
    expect(file('app/serializers/foo-bar.ts'))
        .to.equal(fixture('blueprints/osf-model/serializer.ts'));
}

describe('Blueprint: osf-model', function() {
    setupTestHooks(this);

    it('generates correct files', () => emberNew()
        .then(linkBlueprints)
        .then(() => emberGenerateDestroy(
            ['osf-model', 'foo-bar'],
            file => checkOsfModelFiles(file),
        )));
});
