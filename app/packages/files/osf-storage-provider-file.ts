import { FileSortKey } from 'ember-osf-web/packages/files/file';
import FileProviderModel from 'ember-osf-web/models/file-provider';
import NodeModel from 'ember-osf-web/models/node';
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

    get userCanMoveToHere() {
        const basePermission =  this.currentUserPermission === 'write';
        if (!basePermission) {
            return false;
        }
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
