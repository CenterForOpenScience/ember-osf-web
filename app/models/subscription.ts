import DS from 'ember-data';

import OsfModel from './osf-model';

const { attr } = DS;

export default class SubscriptionModel extends OsfModel {
    @attr('fixstring') eventName!: string;
    @attr('fixstring') frequency!: string;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        subscription: SubscriptionModel;
    } // eslint-disable-line semi
}
