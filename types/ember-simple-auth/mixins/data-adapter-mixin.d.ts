declare module 'ember-simple-auth/mixins/data-adapter-mixin' {
    import Mixin from '@ember/object/mixin';

    interface DataAdapter {
        authorizer: string | null;

        ajaxOptions(...args: any[]): object;
        ensureResponseAuthorized(status: number, headers?: object, payload?: any, requestData?: object): void;
        handleResponse(status: number, headers: object, payload: any, requestData: object);
        headersForRequest();
    }

    const DataAdapterMixin: Mixin<DataAdapter>;

    export default DataAdapterMixin;
}
