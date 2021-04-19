import { belongsTo, attr } from '@ember-data/model';

import UserModel from 'ember-osf-web/models/user';
import OsfModel from './osf-model';
import RegistrationProviderModel from './registration-provider';

export enum PermissionGroup {
    Admin = 'admin',
    Moderator = 'moderator',
}

export default class ModeratorModel extends OsfModel {
    @attr('string') permissionGroup!: PermissionGroup;

    // Write-only attributes
    @attr('string') fullName!: string;
    @attr('string') email!: string;

    @belongsTo('registration-provider', { inverse: 'moderators', polymorphic: true })
    provider!: RegistrationProviderModel;

    @belongsTo('user', { inverse: null })
    user!: UserModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'moderator': ModeratorModel;
    } // eslint-disable-line semi
}
