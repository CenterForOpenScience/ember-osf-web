import { FileSortKey } from 'ember-osf-web/packages/files/file';
import FileProviderModel from 'ember-osf-web/models/file-provider';
import GitlabFile from 'ember-osf-web/packages/files/gitlab-file';
import ProviderFile from 'ember-osf-web/packages/files/provider-file';
import CurrentUserService from 'ember-osf-web/services/current-user';

export default class GitlabProviderFile extends ProviderFile {
    providerHandlesVersioning = false;

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
            return queryResult.map(fileModel => new GitlabFile(this.currentUser, fileModel));
        } catch (e) {
            return this.handleFetchError(e);
        }
    }

    get currentUserPermission(): string {
        return 'read';
    }
}
