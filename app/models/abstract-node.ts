import { hasMany, AsyncHasMany, attr } from '@ember-data/model';
import { PromiseManyArray } from '@ember-data/store/-private';
import BaseFileItem from 'ember-osf-web/models/base-file-item';
import DraftRegistrationModel from 'ember-osf-web/models/draft-registration';
import FileProviderModel from 'ember-osf-web/models/file-provider';
import ReviewActionModel from 'ember-osf-web/models/review-action';
import { Permission } from './osf-model';

export default class AbstractNodeModel extends BaseFileItem {
    @hasMany('file-provider', { inverse: 'target', polymorphic: true })
    files!: AsyncHasMany<FileProviderModel> & FileProviderModel[];

    @hasMany('draft-registration', { inverse: 'branchedFrom' })
    draftRegistrations!: AsyncHasMany<DraftRegistrationModel> & DraftRegistrationModel[];

    @attr('array') currentUserPermissions!: Permission[];

    @hasMany('review-action', { inverse: 'target' })
    reviewActions!: PromiseManyArray<ReviewActionModel>;

}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'abstract-node': AbstractNodeModel;
    } // eslint-disable-line semi
}
