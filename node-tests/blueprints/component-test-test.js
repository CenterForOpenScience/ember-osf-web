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

describe('Blueprint: component-test', function() {
    setupTestHooks(this);

    beforeEach(function() {
        setupPodConfig({ usePods: true });
    });

    describe('in app', function() {
        beforeEach(function() {
            return emberNew().then(linkBlueprints);
        });

        it('component-test x-foo', function() {
            return emberGenerateDestroy(['component-test', 'x-foo'], _file => {
                expect(_file('tests/integration/components/x-foo/component-test.ts')).to.equal(
                    fixture('blueprints/component-test/default.ts'),
                );
            });
        });

        it('component-test x-foo --unit', function() {
            return emberGenerateDestroy(['component-test', 'x-foo', '--unit'], _file => {
                expect(_file('tests/unit/components/x-foo/component-test.ts')).to.equal(
                    fixture('blueprints/component-test/unit.ts'),
                );
            });
        });
    });

    describe('in addon', function() {
        beforeEach(function() {
            return emberNew({ target: 'addon' }).then(linkBlueprints);
        });

        it('component-test x-foo', function() {
            return emberGenerateDestroy(['component-test', 'x-foo'], _file => {
                expect(_file('tests/integration/components/x-foo/component-test.ts')).to.equal(
                    fixture('blueprints/component-test/default.ts'),
                );
            });
        });

        it('component-test x-foo --unit', function() {
            return emberGenerateDestroy(['component-test', 'x-foo', '--unit'], _file => {
                expect(_file('tests/unit/components/x-foo/component-test.ts')).to.equal(
                    fixture('blueprints/component-test/unit.ts'),
                );
            });
        });

        it('component-test x-foo --dummy', function() {
            return emberGenerateDestroy(['component-test', 'x-foo', '--dummy'], _file => {
                expect(_file('tests/integration/components/x-foo/component-test.ts')).to.equal(
                    fixture('blueprints/component-test/default.ts'),
                );
            });
        });
    });

    describe('in in-repo-addon', function() {
        beforeEach(function() {
            return emberNew({ target: 'in-repo-addon' }).then(linkBlueprints);
        });

        it('component-test x-foo --in-repo-addon=my-addon', function() {
            return emberGenerateDestroy(
                ['component-test', 'x-foo', '--in-repo-addon=my-addon'],
                _file => {
                    expect(_file('tests/integration/components/x-foo/component-test.ts')).to.equal(
                        fixture('blueprints/component-test/default.ts'),
                    );
                },
            );
        });

        it('component-test x-foo --in-repo-addon=my-addon --unit', function() {
            return emberGenerateDestroy(
                ['component-test', 'x-foo', '--in-repo-addon=my-addon', '--unit'],
                _file => {
                    expect(_file('tests/unit/components/x-foo/component-test.ts')).to.equal(
                        fixture('blueprints/component-test/unit.ts'),
                    );
                },
            );
        });
    });
});
