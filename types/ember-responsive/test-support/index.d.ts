type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'jumbo';

declare module 'ember-responsive/test-support' {
    export function setBreakpoint(breakpointName: Breakpoint): void;
}
