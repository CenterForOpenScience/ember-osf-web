declare module 'ember-qunit' {
    export interface StartOptions {
        loadTests?: boolean;
        setupTestContainer?: boolean;
        setupTestAdapter?: boolean;
        setupEmberTesting?: boolean;
        setupEmberOnerrorValidation?: boolean;
        startTests?: boolean;
    }

    export function start(options?: StartOptions): void;
}
