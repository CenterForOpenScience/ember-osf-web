import DS from 'ember-data';

import OsfModel from './osf-model';
import ProviderModel from './provider';

const { attr, belongsTo } = DS;

export enum PermissionGroup {
    Admin = 'admin',
    Moderator = 'moderator',
}

export default class ModeratorModel extends OsfModel {
    @attr('string') permissionGroup!: PermissionGroup;
    @attr('string') fullName!: string;
    @attr('string') email!: string;

    @belongsTo('moderator')
    provider?: ProviderModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'moderator': ModeratorModel;
    } // eslint-disable-line semi
}
