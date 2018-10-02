declare module 'katex' {
    export interface KatexRenderOptions {
        displayMode?: boolean;
        throwOnError?: boolean;
        allowedProtocols?: string[];
    }

    export function renderToString(expression: string, options?: KatexRenderOptions): string;
    export function render(expression: string, element: HTMLElement, options?: KatexOptions): void;
}
