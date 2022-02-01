import FileModel from 'ember-osf-web/models/file';
import File from 'ember-osf-web/packages/files/file';

export default class OsfStorageFile extends File {
    constructor(fileModel: FileModel) {
        super(fileModel);
    }
}
