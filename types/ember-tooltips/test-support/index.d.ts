declare module 'ember-tooltips/test-support' {
    export function assertTooltipRendered(assert: Assert): void;
    export function assertTooltipNotRendered(assert: Assert): void;
    export function assertTooltipVisible(assert: Assert): void;
    export function assertTooltipNotVisible(assert: Assert): void;
}
