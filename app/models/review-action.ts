import DS from 'ember-data';
import OsfModel from './osf-model';

const { attr, belongsTo } = DS;

export default class ReviewAction extends OsfModel.extend({
    actionTrigger: attr('string'),
    comment: attr('string'),
    fromState: attr('string'),
    toState: attr('string'),
    dateCreated: attr('date'),
    dateModified: attr('date'),

    // Relationships
    provider: belongsTo('preprint-provider', { inverse: null, async: true }),
    target: belongsTo('preprint', { inverse: 'reviewActions', async: true }),
    creator: belongsTo('user', { inverse: null, async: true }),
}) {}

declare module 'ember-data' {
    interface ModelRegistry {
        'review-action': ReviewAction;
    }
}
