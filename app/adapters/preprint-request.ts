import ActionAdapter from './action';

export default class PreprintRequestAdapter extends ActionAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'preprint-request': PreprintRequestAdapter;
    } // eslint-disable-line semi
}
