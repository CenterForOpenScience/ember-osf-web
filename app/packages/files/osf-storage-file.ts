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

    get userCanUploadToHere() {
        return this.userCanMoveToHere;
    }

    get isUnderStorageLimit() {
        const target = this.fileModel.target as unknown as NodeModel;
        const storageLimitStatus = target.storage.storageLimitStatus;
        const isPublic = target.public;
        if (storageLimitStatus === 'OVER_PUBLIC') {
            return false;
        }
        if (isPublic === false && storageLimitStatus === 'OVER_PRIVATE') {
            return false;
        }
        return true;
    }
}
