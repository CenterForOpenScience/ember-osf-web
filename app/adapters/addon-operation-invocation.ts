import AddonServiceAdapter from './addon-service';

export default class AddonOperationInvocationAdapter extends AddonServiceAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'addon-operation-invocation': AddonOperationInvocationAdapter;
    } // eslint-disable-line semi
}
