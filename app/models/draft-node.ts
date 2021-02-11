import DS from 'ember-data';

import FileProviderModel from 'ember-osf-web/models/file-provider';
import OsfModel from './osf-model';

const { hasMany } = DS;
export default class DraftNode extends OsfModel {
    @hasMany('file-provider', { inverse: 'node' })
    files!: DS.PromiseManyArray<FileProviderModel> & FileProviderModel[];
}
