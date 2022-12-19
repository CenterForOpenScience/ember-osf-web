import { attr, belongsTo, AsyncBelongsTo } from '@ember-data/model';

import UserModel from 'ember-osf-web/models/user';
import OsfModel from './osf-model';

export default class Action extends OsfModel {
    // Override these in subclasses for better type safety
    @attr('string') actionTrigger!: string;
    @attr('string') fromState!: string;
    @attr('string') toState!: string;

    @attr('fixstring') comment!: string;
    @attr('date') dateCreated!: Date;
    @attr('date') dateModified!: Date;
    @attr('boolean') visible!: boolean;
    @attr('boolean') auto!: boolean;

    @belongsTo('user', { inverse: null })
    creator!: AsyncBelongsTo<UserModel> & UserModel;
}
