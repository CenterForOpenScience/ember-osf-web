import $ from 'jquery';
import OsfAdapter from './osf-adapter';

export default class User extends OsfAdapter {
    findHasMany(this: User, store: DS.Store, snapshot: DS.Snapshot, url_: string, relationship: { type: string }): Promise<any> {
        const { id } = snapshot;
        const type: string = snapshot.modelName;

        let url: string = this.urlPrefix(url_, this.buildURL(type, id, snapshot, 'findHasMany'));

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
    }
}


declare module 'ember-data' {
    interface AdapterRegistry {
        'user': User;
    }
}
