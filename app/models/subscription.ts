import DS from 'ember-data';

import OsfModel from './osf-model';

const { attr } = DS;

export enum SubscriptionFrequency {
    Instant = 'instant',
    Daily = 'daily',
    None = 'none',
}

export default class SubscriptionModel extends OsfModel {
    @attr('fixstring') eventName!: string;
    @attr('fixstring') frequency!: SubscriptionFrequency;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        subscription: SubscriptionModel;
    } // eslint-disable-line semi
}
