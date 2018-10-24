import DS from 'ember-data';
import OsfAdapter from './osf-adapter';

export default class UserEmailAdapter extends OsfAdapter {
    parentRelationship = 'user';

    urlForCreateRecord(_: string, snapshot: DS.Snapshot) {
        return snapshot.record.belongsTo('user').value()
            .links.relationships.emails.links.related.href;
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'user-email': UserEmailAdapter;
    } // eslint-disable-line semi
}
