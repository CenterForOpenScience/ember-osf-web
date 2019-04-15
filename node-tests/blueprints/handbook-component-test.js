'use strict';

const fs = require('fs-extra');
const { describe, it } = require('mocha');
const { file } = require('ember-cli-blueprint-test-helpers/chai');

const {
    emberGenerateDestroy,
    emberNew,
    setupTestHooks,
} = require('ember-cli-blueprint-test-helpers/helpers');
const { expect } = require('ember-cli-blueprint-test-helpers/chai');

const linkBlueprints = require('./helpers/link-blueprints');
const fixture = require('../helpers/fixture');

const EXISTING_FILES = {
    'lib/handbook/addon/routes.js': {
        before: 'blueprints/handbook-component/routes-before.js',
        after: 'blueprints/handbook-component/routes-after.js',
    },
    'lib/handbook/addon/docs/template.hbs': {
        before: 'blueprints/handbook-component/docs-template-before.hbs',
        after: 'blueprints/handbook-component/docs-template-after.hbs',
    },
};

const GENERATED_FILES = {
    'lib/handbook/addon/docs/components/foo-bar/template.md': 'blueprints/handbook-component/template.md',
    'lib/handbook/addon/docs/components/foo-bar/-components/demo/template.hbs':
        'blueprints/handbook-component/demo-template.hbs',
};

function setupExistingFiles() {
    Object.keys(EXISTING_FILES).forEach(
        targetPath => {
            fs.ensureFileSync(targetPath);
            fs.copyFileSync(fixture(EXISTING_FILES[targetPath].before).path, targetPath);
        },
    );
}

function checkExistingFiles(beforeOrAfter) {
    Object.keys(EXISTING_FILES).forEach(
        targetPath => expect(file(targetPath))
            .to.equal(fixture(EXISTING_FILES[targetPath][beforeOrAfter])),
    );
}

function checkGeneratedFiles(generatedFile) {
    Object.keys(GENERATED_FILES).forEach(
        targetPath => expect(generatedFile(targetPath)).to.equal(fixture(GENERATED_FILES[targetPath])),
    );
}

describe('Acceptance: ember generate and destroy handbook-component', function() {
    setupTestHooks(this);

    it('handbook-component foo-bar', async () => {
        const args = ['handbook-component', 'foo-bar'];

        await emberNew();
        linkBlueprints();
        setupExistingFiles();

        // Make sure setup worked
        checkExistingFiles('before');

        await emberGenerateDestroy(
            args,
            generatedFile => {
                checkGeneratedFiles(generatedFile);
                checkExistingFiles('after');
            },
        );

        // Back to normal
        checkExistingFiles('before');
    });
});
