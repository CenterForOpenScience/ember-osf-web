const glob = require('glob');
const { expect } = require('chai');
const { describe, it } = require('mocha');

function getSet(path, rgx) {
    return new Set(glob.sync(path).map(file => file.replace(rgx, '$1')));
}

/**
 * Checks for components that do not have a test
 */
describe('Component Metatests', () => {
    const componentNames = getSet(
        './{app,lib/*/addon}/components/**/component.ts',
        /^.*components\/(.*)\/component\.ts$/,
    );
    const componentTestNames = getSet(
        './tests/integration/components/**/component-test.ts',
        /^.*components\/(.*)\/component-test\.ts$/,
    );

    [...componentNames].forEach(name => {
        it(`should have a test for ${name}`, () => {
            expect(componentTestNames).to.include(name);
        });
    });
});

/**
 * Checks for exports with no component (usually because it was deleted)
 */
describe('Exported Components', () => {
    const componentNames = getSet(
        './lib/*/addon/components/**/component.ts',
        /^.*components\/(.*)\/component\.ts$/,
    );
    const exportedComponentNames = getSet(
        './lib/*/app/components/**/component.js',
        /^.*components\/(.*)\/component\.js$/,
    );

    [...exportedComponentNames].forEach(name => {
        it(`should have a component in addon/ directory for exported component ${name} in app/ directory`, () => {
            expect(componentNames).to.include(name);
        });
    });
});
