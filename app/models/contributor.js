import Ember from 'ember';
import DS from 'ember-data';

import OsfModel from './osf-model';

/**
 * @module ember-osf
 * @submodule models
 */

/**
 * Model for OSF APIv2 contributors. Primarily accessed via relationship fields.
 * For field and usage information, see:
 * * https://api.osf.io/v2/docs/#!/v2/Node_Contributors_List_GET
 * @class Contributor
 */
export default OsfModel.extend({
    bibliographic: DS.attr('boolean'),
    permission: DS.attr('fixstring'),

    userId: Ember.computed('_userId', {
        get() {
            if (this.get('isNew')) {
                return this.get('_userId');
            } else {
                return this.get('id').split('-').pop();
            }
        },
        set(_, userId) {
            this.set('_userId', userId);
        },
    }).volatile(),

    nodeId: Ember.computed('_nodeId', {
        get() {
            if (this.get('isNew')) {
                return this.get('_nodeId');
            } else {
                return this.get('id').split('-').shift();
            }
        },
        set(_, nodeId) {
            this.set('_nodeId', nodeId);
        },
    }).volatile(),

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
});
