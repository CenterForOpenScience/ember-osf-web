import OsfAdapter from './osf-adapter';
import Ember from 'ember';

export default OsfAdapter.extend({
    findHasMany(store, snapshot, url, relationship) {
        const id = snapshot.id;
        const type = snapshot.modelName;

        url = this.urlPrefix(url, this.buildURL(type, id, snapshot, 'findHasMany'));

        // If fetching user nodes, will embed root and parent.
        if (relationship.type === 'node') {
            url += '?embed=parent&embed=root';
            if (snapshot.record.get('query-params')) {
                url += `&${Ember.$.param(snapshot.record.get('query-params'))}`;
            }
        } else if (snapshot.record.get('query-params')) {
            url += `?${Ember.$.param(snapshot.record.get('query-params'))}`;
        }
        return this.ajax(url, 'GET');
    },
});
