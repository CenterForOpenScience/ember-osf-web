import OsfAdapter from './osf-adapter';

export default class AccountAdapter extends OsfAdapter {
    parentRelationship = 'addon';
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        account: AccountAdapter;
    } // eslint-disable-line semi
}
