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
        if (this.currentUserPermission === 'write' &&
            this.fileModel.target.get('modelName') !== 'registration' &&
            this.isFolder &&
            this.isUnderStorageLimit
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

    get isUnderStorageLimit() {
        return underStorageLimit(this.fileModel.target as unknown as NodeModel);
    }

    get isCheckedOut() {
        return Boolean(this.fileModel.checkout);
    }
}

export async function underStorageLimit(target: NodeModel) {
    const storage = await target.get('storage');
    return !storage.isOverStorageCap;
}
