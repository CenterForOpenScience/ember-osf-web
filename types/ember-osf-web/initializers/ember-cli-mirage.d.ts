declare module 'ember-osf-web/initializers/ember-cli-mirage' {
    class MirageServer {
        shutdown(): void;
    }

    // eslint-disable-next-line import/prefer-default-export
    export function startMirage(): MirageServer;
}
