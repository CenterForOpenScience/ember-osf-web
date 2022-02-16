import { FileSortKey } from 'ember-osf-web/packages/files/file';
import FileProviderModel from 'ember-osf-web/models/file-provider';
import OsfStorageFile from 'ember-osf-web/packages/files/osf-storage-file';
import ProviderFile from 'ember-osf-web/packages/files/provider-file';

export default class OsfStorageProviderFile extends ProviderFile {
    constructor(providerFileModel: FileProviderModel) {
        super(providerFileModel);
    }

    async getFolderItems(page: number, sort: FileSortKey, filter: string ) {
        const queryResult = await this.fileModel.queryHasMany('files',
            {
                page,
                sort,
                'filter[name]': filter,
            });
        this.totalFileCount = queryResult.meta.total;
        return queryResult.map(fileModel => new OsfStorageFile(fileModel));
    }
}
