import DS from 'ember-data';
import OsfSerializer from './osf-serializer';

export default class Preprint extends OsfSerializer.extend({
    serialize(snapshot: DS.Snapshot): any {
        const res: any = this._super(...arguments);

        if (res.data.attributes && 'subjects' in snapshot.record.changedAttributes()) {
            res.data.attributes.subjects = (snapshot.record.get('subjects') || []);
        }

        return res;
    },
}) {
    relationshipTypes = {
        primaryFile: 'files',
        node: 'nodes',
        provider: 'providers',
        license: 'licenses',
    };
}

declare module 'ember-data' {
    interface SerializerRegistry {
        'preprint': Preprint;
    }
}
