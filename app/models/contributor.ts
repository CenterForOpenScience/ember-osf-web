import { computed } from '@ember/object';
import DS from 'ember-data';

import OsfModel from './osf-model';
/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 contributors. Primarily accessed via relationship fields.
 * For field and usage information, see:
 * * https://api.osf.io/v2/docs/#!/v2/Node_Contributors_List_GET
 * @class Contributor
 */
export default class Contributor extends OsfModel.extend({
    permission: DS.attr('fixstring'),
    bibliographic: DS.attr('boolean'),

    unregisteredContributor: DS.attr('fixstring'),
    index: DS.attr('number'),
    fullName: DS.attr('fixstring'),
    email: DS.attr('fixstring'),
    sendEmail: DS.attr('boolean'),
    users: DS.belongsTo('user'),
    node: DS.belongsTo('node', {
        inverse: 'contributors',
    }),

    _userId: null,
    _nodeId: null,
}) {
    userId = computed('_userId', {
        get(): string {
            if (this.get('isNew')) {
                return this.get('_userId');
            } else {
                return this.get('id').split('-').pop();
            }
        },
        set(_:any, userId: string): void {
            this.set('_userId', userId);
        },
    }).volatile();

    nodeId = computed('_nodeId', {
        get(): string {
            if (this.get('isNew')) {
                return this.get('_nodeId');
            } else {
                return this.get('id').split('-').shift();
            }
        },
        set(_: any, nodeId: string): void {
            this.set('_nodeId', nodeId);
        },
    }).volatile();
}


declare module 'ember-data' {
    interface ModelRegistry {
        'contributor': Contributor;
    }
}
