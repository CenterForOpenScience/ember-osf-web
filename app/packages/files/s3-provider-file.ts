import { FileSortKey } from 'ember-osf-web/packages/files/file';
import FileProviderModel from 'ember-osf-web/models/file-provider';
import S3File from 'ember-osf-web/packages/files/s3-file';
import ProviderFile from 'ember-osf-web/packages/files/provider-file';
import CurrentUserService from 'ember-osf-web/services/current-user';

export default class S3ProviderFile extends ProviderFile {
    providerHandlesVersioning = false;

    constructor(owner: unknown, currentUser: CurrentUserService,providerFileModel: FileProviderModel) {
        super(owner, currentUser, providerFileModel);
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
            return queryResult.map(fileModel => new S3File(this.owner, this.currentUser, fileModel));
        } catch (e) {
            return this.handleFetchError(e);
        }
    }
}
