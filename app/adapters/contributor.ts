import { service } from '@ember-decorators/service';
import DS from 'ember-data';

import param from 'ember-osf-web/utils/param';

import OsfAdapter from './osf-adapter';

export default class ContributorAdapter extends OsfAdapter {
    @service store!: DS.Store;

    buildURL(
        modelName: 'contributor',
        id: string,
        snapshot: DS.Snapshot,
        requestType: string,
    ) {
        if (requestType === 'createRecord' || requestType === 'findRecord') {
            const [nId, uId] = (id || '').split('-');
            const nodeId = snapshot ? snapshot.record.get('nodeId') : nId;
            const node = this.store.peekRecord('node', nodeId);

            if (!node) {
                throw new Error('Trying to add a contributor to a Node that hasn\'t been loaded into the store');
            }

            const base = this.buildRelationshipURL((node as any)._internalModel.createSnapshot(), 'contributors');

            if (requestType === 'findRecord') {
                return `${base}${uId}/`;
            }

            const params = {
                // Needed for Ember Data to update the inverse record's (the node's) relationship
                embed: 'node',
                send_email: snapshot ? (snapshot.record.get('sendEmail') || false) : true,
            };

            return `${base}?${param(params)}`;
        }

        return super.buildURL(modelName, id, snapshot, requestType);
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        contributor: ContributorAdapter;
    } // eslint-disable-line semi
}
