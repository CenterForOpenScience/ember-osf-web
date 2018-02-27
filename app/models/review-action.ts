import DS from 'ember-data';
import OsfModel from './osf-model';

export default class ReviewAction extends OsfModel.extend({
    actionTrigger: DS.attr('string'),
    comment: DS.attr('string'),
    fromState: DS.attr('string'),
    toState: DS.attr('string'),
    dateCreated: DS.attr('date'),
    dateModified: DS.attr('date'),

    // Relationships
    provider: DS.belongsTo('preprint-provider', { inverse: null, async: true }),
    target: DS.belongsTo('preprint', { inverse: 'reviewActions', async: true }),
    creator: DS.belongsTo('user', { inverse: null, async: true }),
}) {
    // normal class body definition here
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data' {
    interface ModelRegistry {
        'review-action': ReviewAction;
    }
}
