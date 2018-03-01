import DS from 'ember-data'; // eslint-disable-line no-unused-vars
import OsfSerializer from './osf-serializer';

export default class Preprint extends OsfSerializer.extend({
    serialize(snapshot: DS.Snapshot): any {
        const res: any = this._super(...arguments);
        if (res.data.attributes && 'subjects' in snapshot.record.changedAttributes()) { res.data.attributes.subjects = (snapshot.record.get('subjects') || []); }
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

// DO NOT DELETE: this is how TypeScript knows how to look up your serializers.
declare module 'ember-data' {
    interface SerializerRegistry {
        'preprint': Preprint;
    }
}
