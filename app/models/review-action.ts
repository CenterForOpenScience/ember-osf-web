import { attr, belongsTo } from '@ember-decorators/data';
import DS from 'ember-data';
import OsfModel from './osf-model';
import Preprint from './preprint';
import PreprintProvider from './preprint-provider';
import User from './user';

export default class ReviewAction extends OsfModel {
    @attr('string') actionTrigger!: string;
    @attr('string') comment!: string;
    @attr('string') fromState!: string;
    @attr('string') toState!: string;
    @attr('date') dateCreated!: Date;
    @attr('date') dateModified!: Date;

    // Relationships
    @belongsTo('preprint-provider', { inverse: null }) provider!: DS.PromiseObject<PreprintProvider> & PreprintProvider;
    @belongsTo('preprint', { inverse: 'reviewActions' }) target!: DS.PromiseObject<Preprint> & Preprint;
    @belongsTo('user', { inverse: null }) creator!: DS.PromiseObject<User> & User;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'review-action': ReviewAction;
    } // eslint-disable-line semi
}
