import DS from 'ember-data';
import config from 'ember-get-config';

import pathJoin from 'ember-osf-web/utils/path-join';

import OsfAdapter from './osf-adapter';

const { OSF: { apiUrl, apiNamespace } } = config;

export default class DraftRegistration extends OsfAdapter {
    urlForCreateRecord(_: string, snapshot: DS.Snapshot) {
        return pathJoin(
            apiUrl,
            apiNamespace,
            'nodes',
            snapshot.record.belongsTo('branchedFrom').belongsToRelationship.members.list.firstObject.id,
            'draft_registrations',
        );
    }
}

declare module 'ember-data' {
    interface AdapterRegistry {
        'draft-registration': DraftRegistration;
    }
}
