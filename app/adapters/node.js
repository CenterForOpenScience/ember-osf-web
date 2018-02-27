import OsfAdapter from './osf-adapter';

export default OsfAdapter.extend({
    buildURL(modelName, id, snapshot, requestType) { // jshint ignore:line
        if (requestType === 'createRecord') {
            const parent = snapshot.record.belongsTo('parent').belongsToRelationship.members.list[0];
            if (parent) {
                return this._buildRelationshipURL(
                    parent.createSnapshot(),
                    'children',
                );
            }
        }
        return this._super(...arguments);
    },
    _handleRelatedRequest(_, __, ___, relationship) {
        if (relationship.includes('license')) {
            return;
        }
        return this._super(...arguments);
    },
});
