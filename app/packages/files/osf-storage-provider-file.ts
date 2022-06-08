import { FileSortKey } from 'ember-osf-web/packages/files/file';
import { underStorageLimit } from 'ember-osf-web/packages/files/osf-storage-file';
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
        if (this.currentUserPermission === 'write' &&
            this.fileModel.target.get('modelName') !== 'registration' &&
            this.isFolder &&
            underStorageLimit(this.fileModel.target as unknown as NodeModel)
        ) {
            return true;
        }
        return false;
    }

    get userCanUploadToHere() {
        return this.userCanMoveToHere;
    }
}
