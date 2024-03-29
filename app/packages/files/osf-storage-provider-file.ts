import { FileSortKey } from 'ember-osf-web/packages/files/file';
import FileProviderModel from 'ember-osf-web/models/file-provider';
import OsfStorageFile from 'ember-osf-web/packages/files/osf-storage-file';
import ProviderFile from 'ember-osf-web/packages/files/provider-file';
import CurrentUserService from 'ember-osf-web/services/current-user';
import NodeModel from 'ember-osf-web/models/node';

export default class OsfStorageProviderFile extends ProviderFile {
    constructor(currentUser: CurrentUserService,providerFileModel: FileProviderModel) {
        super(currentUser, providerFileModel);
    }

    async getFolderItems(page: number, sort: FileSortKey, filter: string ) {
        try {
            const queryResult = await this.fileModel.queryHasMany('files',
                {
                    page,
                    sort,
                    'filter[name]': filter,
                });
            this.totalFileCount = queryResult.meta.total;
            return queryResult.map(fileModel => new OsfStorageFile(this.currentUser, fileModel));
        } catch (e) {
            return this.handleFetchError(e);
        }
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

    get userCanUploadToHere() {
        return this.userCanMoveToHere;
    }
}
