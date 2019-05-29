import { attr } from '@ember-decorators/data';

import OsfModel from './osf-model';

export enum Status {
    Create = 'CREATE',
    Link = 'LINK',
    Verified = 'VERIFIED',
}

export default class ExternalIdentityModel extends OsfModel {
    @attr('string') status!: Status;
    @attr('string') externalId!: string;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'external-identity': ExternalIdentityModel;
    } // eslint-disable-line semi
}
