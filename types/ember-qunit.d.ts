declare module 'ember-qunit' {
    import Resolver from '@ember/resolver';

    export interface StartOptions {
        loadTests?: boolean;
        setupTestContainer?: boolean;
        setupTestAdapter?: boolean;
        setupEmberTesting?: boolean;
        setupEmberOnerrorValidation?: boolean;
        startTests?: boolean;
    }

    export function start(options?: StartOptions): void;

    export interface SetupTestOptions {
        resolver: Resolver;
    }

    export function setupTest(hooks: NestedHooks, options?: SetupTestOptions): void;
    export function setupRenderingTest(hooks: NestedHooks, options?: SetupTestOptions): void;
    export function setupApplicationTest(hooks: NestedHooks, options?: SetupTestOptions): void;
}
