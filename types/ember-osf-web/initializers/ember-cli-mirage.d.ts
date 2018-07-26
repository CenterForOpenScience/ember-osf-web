declare module 'ember-osf-web/initializers/ember-cli-mirage' {
    class MirageServer {
        schema: {};
        shutdown(): void;
        create(model: string, settings?: {}, trait?: string): any;
        createList(model: string, count: number, settings?: {}, trait?: string): any[];
    }

    // eslint-disable-next-line import/prefer-default-export
    export function startMirage(): MirageServer;
}
