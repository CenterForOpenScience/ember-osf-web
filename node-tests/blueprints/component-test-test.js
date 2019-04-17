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
const fixture = require('../helpers/fixture');

describe('Blueprint: component-test', function() {
    setupTestHooks(this);

    describe('in app', () => {
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

        it('component-test x-foo', () => emberGenerateDestroy(['component-test', 'x-foo'], _file => {
            expect(_file('tests/integration/components/x-foo/component-test.ts')).to.equal(
                fixture('blueprints/component-test/default.ts'),
            );
        }));

        it('component-test x-foo --unit', () => emberGenerateDestroy(['component-test', 'x-foo', '--unit'], _file => {
            expect(_file('tests/unit/components/x-foo/component-test.ts')).to.equal(
                fixture('blueprints/component-test/unit.ts'),
            );
        }));
    });

    describe('in addon', () => {
        beforeEach(() => emberNew({ target: 'addon' })
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

        it('component-test x-foo', () => emberGenerateDestroy(['component-test', 'x-foo'], _file => {
            expect(_file('tests/integration/components/x-foo/component-test.ts')).to.equal(
                fixture('blueprints/component-test/default.ts'),
            );
        }));

        it('component-test x-foo --unit', () => emberGenerateDestroy(['component-test', 'x-foo', '--unit'], _file => {
            expect(_file('tests/unit/components/x-foo/component-test.ts')).to.equal(
                fixture('blueprints/component-test/unit.ts'),
            );
        }));

        it('component-test x-foo --dummy', () => emberGenerateDestroy(['component-test', 'x-foo', '--dummy'], _file => {
            expect(_file('tests/integration/components/x-foo/component-test.ts')).to.equal(
                fixture('blueprints/component-test/default.ts'),
            );
        }));
    });

    describe('in in-repo-addon', () => {
        beforeEach(() => emberNew({ target: 'in-repo-addon' })
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

        it('component-test x-foo --in-repo-addon=my-addon', () => emberGenerateDestroy(
            ['component-test', 'x-foo', '--in-repo-addon=my-addon'],
            _file => {
                expect(_file('tests/integration/components/x-foo/component-test.ts')).to.equal(
                    fixture('blueprints/component-test/default.ts'),
                );
            },
        ));

        it('component-test x-foo --in-repo-addon=my-addon --unit', () => emberGenerateDestroy(
            ['component-test', 'x-foo', '--in-repo-addon=my-addon', '--unit'],
            _file => {
                expect(_file('tests/unit/components/x-foo/component-test.ts')).to.equal(
                    fixture('blueprints/component-test/unit.ts'),
                );
            },
        ));
    });
});
