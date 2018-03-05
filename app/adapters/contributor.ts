import DS from 'ember-data'; // eslint-disable-line no-unused-vars
import OsfAdapter from './osf-adapter';
import Node from 'ember-osf-web/models/node'; // eslint-disable-line no-unused-vars

export default class Contributor extends OsfAdapter.extend({
    buildURL(this: Contributor, modelName: string, id: string, snapshot: DS.Snapshot, requestType: string): string {
        if (requestType === 'createRecord' || requestType === 'findRecord') {
            let nodeId: string;
            let sendEmail: boolean | string = true;
            if (snapshot) {
                nodeId = snapshot.record.get('nodeId');
                sendEmail = snapshot.record.get('sendEmail');
            } else {
                nodeId = id.split('-').shift();
            }

            const node: Node = this.store.peekRecord('node', nodeId);
            if (node) {
                const base: string = this._buildRelationshipURL(
                    node._internalModel.createSnapshot(),
                    'contributors',
                );

                if (requestType === 'findRecord') {
                    return `${base}${id.split('-').pop()}/`;
                }

                // Needed for Ember Data to update the inverse record's (the node's) relationship
                let requestUrl: string = `${base}?embed=node`;

                if (!sendEmail) {
                    requestUrl += '&send_email=false';
                } else if (sendEmail === 'preprint') {
                    requestUrl += '&send_email=preprint';
                }

                return requestUrl;
            } else {
                throw new Error('Trying to add a contributor to a Node that hasn\'t been loaded into the store');
            }
        }
        return this._super(...arguments);
    },
}) {}


declare module 'ember-data' {
    interface AdapterRegistry {
        'contributor': Contributor;
    }
}
