import DS from 'ember-data';
import OsfAdapter from './osf-adapter';

export default class UserEmailAdapter extends OsfAdapter {
    urlForCreateRecord(_: string, snapshot: DS.Snapshot) {
        return snapshot.record.belongsTo('user').value()
            .links.relationships.emails.links.related.href;
    }
}

declare module 'ember-data' {
    interface AdapterRegistry {
        'user-email': UserEmailAdapter;
    }
}
