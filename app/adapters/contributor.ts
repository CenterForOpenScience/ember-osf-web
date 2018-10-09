import { service } from '@ember-decorators/service';
import DS from 'ember-data';
import $ from 'jquery';
import OsfAdapter from './osf-adapter';

export default class Contributor extends OsfAdapter.extend({
    buildURL(
        this: Contributor,
        modelName: 'contributor',
        id: string | undefined,
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

            return `${base}?${$.param(params)}`;
        }

        return this._super(modelName, id, snapshot, requestType);
    },
}) {
    @service store!: DS.Store;
}

declare module 'ember-data' {
    interface AdapterRegistry {
        contributor: Contributor;
    }
}
