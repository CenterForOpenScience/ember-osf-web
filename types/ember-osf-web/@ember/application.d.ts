import Application from '@ember/application';

declare module '@ember/application' {
    export default interface Application {
        buildInstance(): ApplicationInstance;
    } // eslint-disable-line semi
}
