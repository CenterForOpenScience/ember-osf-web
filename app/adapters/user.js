import $ from 'jquery';
import OsfAdapter from './osf-adapter';

export default OsfAdapter.extend({
    findHasMany(store, snapshot, url_, relationship) {
        const { id } = snapshot;
        const type = snapshot.modelName;

        let url = this.urlPrefix(url_, this.buildURL(type, id, snapshot, 'findHasMany'));

        // If fetching user nodes, will embed root and parent.
        if (relationship.type === 'node') {
            url += '?embed=parent&embed=root';
            if (snapshot.record.get('query-params')) {
                url += `&${$.param(snapshot.record.get('query-params'))}`;
            }
        } else if (snapshot.record.get('query-params')) {
            url += `?${$.param(snapshot.record.get('query-params'))}`;
        }
        return this.ajax(url, 'GET');
    },
});
