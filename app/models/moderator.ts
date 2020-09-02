import DS from 'ember-data';

import OsfModel from './osf-model';

const { attr } = DS;

export enum PermissionGroup {
    Admin = 'admin',
    Moderator = 'moderator',
}

export default class ModeratorModel extends OsfModel {
    @attr('string') permissionGroup!: PermissionGroup;
    @attr('string') fullName!: string;
    @attr('string') email!: string;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'moderator': ModeratorModel;
    } // eslint-disable-line semi
}
