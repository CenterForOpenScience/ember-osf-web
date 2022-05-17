import { FileSortKey } from 'ember-osf-web/packages/files/file';
import isUnderStorageLimit from 'ember-osf-web/packages/files/osf-storage-file';
import FileProviderModel from 'ember-osf-web/models/file-provider';
import OsfStorageFile from 'ember-osf-web/packages/files/osf-storage-file';
import ProviderFile from 'ember-osf-web/packages/files/provider-file';
import CurrentUserService from 'ember-osf-web/services/current-user';

export default class OsfStorageProviderFile extends ProviderFile {
    constructor(currentUser: CurrentUserService,providerFileModel: FileProviderModel) {
        super(currentUser, providerFileModel);
    }

    async getFolderItems(page: number, sort: FileSortKey, filter: string ) {
        const queryResult = await this.fileModel.queryHasMany('files',
            {
                page,
                sort,
                'filter[name]': filter,
            });
        this.totalFileCount = queryResult.meta.total;
        return queryResult.map(fileModel => new OsfStorageFile(this.currentUser, fileModel));
    }

    get userCanMoveToHere(): boolean {
        if (this.currentUserPermission === 'write' &&
            this.fileModel.target.get('modelName') !== 'registration' &&
            this.isFolder &&
            isUnderStorageLimit
        ) {
            return true;
        }
        return false;
    }

    get userCanUploadToHere() {
        return this.userCanMoveToHere;
    }
}
