import FileModel from 'ember-osf-web/models/file';
import File from 'ember-osf-web/packages/files/file';
import isUnderStorageLimit from 'ember-osf-web/packages/files/file';
import CurrentUserService from 'ember-osf-web/services/current-user';

export default class OsfStorageFile extends File {
    shouldShowTags = true;

    constructor(currentUser: CurrentUserService,fileModel: FileModel) {
        super(currentUser, fileModel);
    }

    get userCanUploadToHere() {
        if (this.currentUserPermission === 'write' && isUnderStorageLimit) {
            return true;
        }
        return false;
    }
}
