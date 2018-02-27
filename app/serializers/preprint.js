import OsfSerializer from './osf-serializer';

export default OsfSerializer.extend({
    // Serialize these relationships
    relationshipTypes: {
        primaryFile: 'files',
        node: 'nodes',
        provider: 'providers',
        license: 'licenses',
    },

    serialize(snapshot) {
        const res = this._super(...arguments);
        if (res.data.attributes && 'subjects' in snapshot.record.changedAttributes()) { res.data.attributes.subjects = (snapshot.record.get('subjects') || []); }
        return res;
    },
});
