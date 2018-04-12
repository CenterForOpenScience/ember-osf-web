import { attr, belongsTo } from '@ember-decorators/data';
import OsfModel from './osf-model';

export default class ReviewAction extends OsfModel {
    @attr('string') actionTrigger;
    @attr('string') comment;
    @attr('string') fromState;
    @attr('string') toState;
    @attr('date') dateCreated;
    @attr('date') dateModified;

    // Relationships
    @belongsTo('preprint-provider', { inverse: null, async: true }) provider;
    @belongsTo('preprint', { inverse: 'reviewActions', async: true }) target;
    @belongsTo('user', { inverse: null, async: true }) creator;
}

declare module 'ember-data' {
    interface ModelRegistry {
        'review-action': ReviewAction;
    }
}
