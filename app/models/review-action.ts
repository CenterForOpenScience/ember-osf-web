import { attr, belongsTo } from '@ember-decorators/data';
import OsfModel from './osf-model';
import Preprint from './preprint';
import PreprintProvider from './preprint-provider';
import User from './user';

export default class ReviewAction extends OsfModel {
    @attr('string') actionTrigger: string;
    @attr('string') comment: string;
    @attr('string') fromState: string;
    @attr('string') toState: string;
    @attr('date') dateCreated: Date;
    @attr('date') dateModified: Date;

    // Relationships
    @belongsTo('preprint-provider', { inverse: null, async: true }) provider: PreprintProvider;
    @belongsTo('preprint', { inverse: 'reviewActions', async: true }) target: Preprint;
    @belongsTo('user', { inverse: null, async: true }) creator: User;
}

declare module 'ember-data' {
    interface ModelRegistry {
        'review-action': ReviewAction;
    }
}
