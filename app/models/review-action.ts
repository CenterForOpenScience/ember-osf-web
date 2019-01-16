import { attr, belongsTo } from '@ember-decorators/data';
import DS from 'ember-data';

import OsfModel from './osf-model';
import PreprintModel from './preprint';
import PreprintProviderModel from './preprint-provider';
import UserModel from './user';

export default class ReviewActionModel extends OsfModel {
    @attr('string') actionTrigger!: string;
    @attr('string') comment!: string;
    @attr('string') fromState!: string;
    @attr('string') toState!: string;
    @attr('date') dateCreated!: Date;
    @attr('date') dateModified!: Date;

    @belongsTo('preprint-provider', { inverse: null })
    provider!: DS.PromiseObject<PreprintProviderModel> & PreprintProviderModel;

    @belongsTo('preprint', { inverse: 'reviewActions' })
    target!: DS.PromiseObject<PreprintModel> & PreprintModel;

    @belongsTo('user', { inverse: null })
    creator!: DS.PromiseObject<UserModel> & UserModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'review-action': ReviewActionModel;
    } // eslint-disable-line semi
}
