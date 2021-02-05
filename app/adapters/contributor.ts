import { assert } from '@ember/debug';
import { inject as service } from '@ember/service';
import DS from 'ember-data';
import OsfAdapter from './osf-adapter';

export default class ContributorAdapter extends OsfAdapter {
    @service store!: DS.Store;

    buildURL(
        modelName: 'contributor',
        id: string,
        snapshot: DS.Snapshot<'contributor'>,
        requestType: string,
    ) {
        if (requestType === 'findRecord') {
            const [objectId, userId] = (id || '').split('-');
            let baseUrl;
            assert(`"contributorId" must be "objectId-userId": got ${objectId}-${userId}`, Boolean(objectId && userId));
            if (objectId.length === 5) {
                // object is a node because objectId is a 5 digit guid
                const node = this.store.peekRecord('node', objectId);
                baseUrl = this.buildRelationshipURL((node as any)._internalModel.createSnapshot(), 'contributors');
            } else {
                // object is not a node (only possibility is a draft_registration as of now)
                const draft = this.store.peekRecord('draft-registration', objectId);
                baseUrl = this.buildRelationshipURL((draft as any)._internalModel.createSnapshot(), 'contributors');
            }
            return `${baseUrl}${userId}/`;
        }

        if (requestType === 'createRecord') {
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
