import { attr, belongsTo, AsyncBelongsTo } from '@ember-data/model';
import UserModel from 'ember-osf-web/models/user';
import humanFileSize from 'ember-osf-web/utils/human-file-size';

import OsfModel from './osf-model';

export default class InstitutionUserModel extends OsfModel {
    @attr('fixstring') userName!: string;
    @attr('fixstring') department?: string;
    @attr('number') publicProjects!: number;
    @attr('number') privateProjects!: number;
    @attr('number') publicRegistrationCount!: number;
    @attr('number') embargoedRegistrationCount!: number;
    @attr('number') publishedPreprintCount!: number;
    @attr('number') publicFileCount!: number;
    @attr('number') storageByteCount!: number;
    @attr('number') totalObjectCount!: number;
    @attr('date') monthLastLogin!: Date;
    @attr('date') monthLastActive!: Date;
    @attr('date') accountCreationDate!: Date;
    @attr('fixstring') orcidId?: string;

    @belongsTo('user', { async: true })
    user!: AsyncBelongsTo<UserModel> & UserModel;

    get userGuid() {
        return (this as InstitutionUserModel).belongsTo('user').id();
    }

    get userDataUsage() {
        return humanFileSize(this.storageByteCount);
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'institution-user': InstitutionUserModel;
    } // eslint-disable-line semi
}
