import DS from 'ember-data';

import FileProviderModel from 'ember-osf-web/models/file-provider';
import OsfModel from './osf-model';

const { hasMany } = DS;
export default class DraftNode extends OsfModel {
    @hasMany('file-provider', { inverse: 'draftNode' })
    files!: DS.PromiseManyArray<FileProviderModel> & FileProviderModel[];
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'draft-node': DraftNode;
    } // eslint-disable-line semi
}
