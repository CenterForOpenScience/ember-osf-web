import OsfAdapter from './osf-adapter';

export default class RevisionActionAdapter extends OsfAdapter {
    parentRelationship = 'target';
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'revision-action': RevisionActionAdapter;
    } // eslint-disable-line semi
}
