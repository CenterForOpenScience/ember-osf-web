declare module '@ember/test-helpers' {
    import { TemplateFactory } from 'htmlbars-inline-precompile';

    export function render(template?: string | string[] | TemplateFactory): Promise<void>;
    export function settled(): Promise<void>;
    export function setResolver(resolver: any): void;
    export function click(element: Node): Promise<void>;
    export function findAll(selector: string): Element[];
}
