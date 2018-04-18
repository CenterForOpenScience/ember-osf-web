import DS from 'ember-data';
import Node from 'ember-osf-web/models/node';
import OsfAdapter from './osf-adapter';

const requestTypes = ['createRecord', 'findRecord'];

export default class Contributor extends OsfAdapter.extend({
    buildURL(
        this: Contributor,
        modelName: 'contributor',
        id: string,
        snapshot: DS.Snapshot,
        requestType: string,
    ): string {
        if (requestTypes.includes(requestType)) {
            return this._super(modelName, id, snapshot, requestType);
        }

        const nodeId: string = snapshot ? snapshot.record.get('nodeId') : (id.split('-').shift() as string);
        const node: Node = this.store.peekRecord('node', nodeId);

        if (!node) {
            throw new Error('Trying to add a contributor to a Node that hasn\'t been loaded into the store');
        }

        const base: string = this._buildRelationshipURL(
            node._internalModel.createSnapshot(),
            'contributors',
        );

        if (requestType === 'findRecord') {
            return `${base}${id.split('-').pop()}/`;
        }

        const sendEmail: boolean | string = snapshot ? snapshot.record.get('sendEmail') : true;

        // Needed for Ember Data to update the inverse record's (the node's) relationship
        return `${base}?embed=node&send_email=${sendEmail}`;
    },
}) {}

declare module 'ember-data' {
    interface AdapterRegistry {
        'contributor': Contributor;
    }
}
