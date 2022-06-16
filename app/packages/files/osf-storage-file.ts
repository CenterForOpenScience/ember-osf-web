import FileModel from 'ember-osf-web/models/file';
import NodeModel from 'ember-osf-web/models/node';
import File from 'ember-osf-web/packages/files/file';
import CurrentUserService from 'ember-osf-web/services/current-user';

export default class OsfStorageFile extends File {
    shouldShowTags = true;

    constructor(currentUser: CurrentUserService,fileModel: FileModel) {
        super(currentUser, fileModel);
    }

    get userCanMoveToHere(): boolean {
        const target = this.fileModel.target as unknown as NodeModel;
        if (target.get('modelName') === 'registration') {
            return false;
        }
        const storage = target.get('storage');
        if (this.currentUserPermission === 'write' &&
            this.isFolder &&
            !storage.get('isOverStorageCap')
        ) {
            return true;
        }
        return false;
    }

    get currentUserCanDelete() {
        return super.currentUserCanDelete && !this.isCheckedOut;
    }

    get userCanUploadToHere() {
        return this.userCanMoveToHere;
    }

    get isCheckedOut() {
        return Boolean(this.fileModel.checkout);
    }
}
