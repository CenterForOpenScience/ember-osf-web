import Store from '@ember-data/store';
import { assert } from '@ember/debug';
import { inject as service } from '@ember/service';

import pathJoin from 'ember-osf-web/utils/path-join';
import OsfAdapter from './osf-adapter';

export default class ContributorAdapter extends OsfAdapter {
    @service store!: Store;

    buildURL(
        modelName?: string | number,
        id?: string,
        snapshot?: DS.Snapshot | null,
        requestType?: string,
    ) {
        if (requestType === 'findRecord') {
            const [objectId, userId] = (id || '').split('-');
            const node = this.store.peekRecord('node', objectId);
            const draft = this.store.peekRecord('draft-registration', objectId);
            let baseUrl;
            assert(`"contributorId" must be "objectId-userId": got ${objectId}-${userId}`, Boolean(objectId && userId));
            if (node) {
                baseUrl = this.buildRelationshipURL((node as any)._internalModel.createSnapshot(), 'contributors');
            } else {
                baseUrl = this.buildRelationshipURL((draft as any)._internalModel.createSnapshot(), 'contributors');
            }
            return pathJoin(baseUrl, userId);
        }

        if (snapshot && requestType === 'createRecord') {
            const node = snapshot.belongsTo('node');
            const draftRegistration = snapshot.belongsTo('draftRegistration');
            const user = snapshot.belongsTo('users');
            assert('"node" or "draftRegistration" relationship is needed to create a contributor',
                Boolean(node || draftRegistration));
            assert('"users" relationship, "email" or "fullName" is needed to create a contributor',
                Boolean(user || snapshot.attr('email') || snapshot.attr('fullName')));
            let baseUrl;
            if (node) {
                // if node relationship is defined
                // we post to v2/nodes/<node_id>/contributors
                baseUrl = this.buildRelationshipURL(node, 'contributors');
            }

            if (draftRegistration) {
                // if draftRegistration relationship is defined
                // we post to v2/draft_registrations/<draft_id>/contributors
                baseUrl = this.buildRelationshipURL(draftRegistration, 'contributors');
            }
            return `${baseUrl}`;
        }
        return super.buildURL(modelName, id, snapshot, requestType);
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        contributor: ContributorAdapter;
    } // eslint-disable-line semi
}
