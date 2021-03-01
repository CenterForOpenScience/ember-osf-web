import DS from 'ember-data';

import BaseFileItem from 'ember-osf-web/models/base-file-item';
import DraftRegistrationModel from 'ember-osf-web/models/draft-registration';
import FileProviderModel from 'ember-osf-web/models/file-provider';

const { hasMany } = DS;

export default class AbstractNodeModel extends BaseFileItem {
    @hasMany('file-provider', { inverse: 'draftNode' })
    files!: DS.PromiseManyArray<FileProviderModel> & FileProviderModel[];

    @hasMany('draft-registration', { inverse: 'branchedFrom' })
    draftRegistrations!: DS.PromiseManyArray<DraftRegistrationModel> & DraftRegistrationModel[];
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'abstract-node': AbstractNodeModel;
    } // eslint-disable-line semi
}
