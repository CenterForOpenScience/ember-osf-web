declare module 'ember-animated/test-support' {
    export function animationsSettled(): void;
    export function setupAnimationTest(hooks: NestedHooks): void;
    export class TimeControl {
        runAtSpeed(factor: number): void;

        pause(): void;

        finished(): void;

        advance(ms: number): void;
    }
}
