declare module 'ember-simple-auth/mixins/data-adapter-mixin' {
    import { service } from '@ember-decorators/service';
    import Mixin from '@ember/object/mixin';

    interface DataAdapter {
        authorizer: string | null;

        ajaxOptions(...args: any[]): object;
        /* eslint-disable no-restricted-globals */
        ensureResponseAuthorized(status: number, headers?: object, payload?: any, requestData?: object): void;
        handleResponse(status: number, headers: object, payload: any, requestData: object);
        /* eslint-enable no-restricted-globals */
        headersForRequest();
    }

    const DataAdapterMixin: Mixin<DataAdapter>;

    export default DataAdapterMixin;
}
