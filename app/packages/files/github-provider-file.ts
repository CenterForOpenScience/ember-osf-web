import { FileSortKey } from 'ember-osf-web/packages/files/file';
import FileProviderModel from 'ember-osf-web/models/file-provider';
import GithubFile from 'ember-osf-web/packages/files/github-file';
import ProviderFile from 'ember-osf-web/packages/files/provider-file';
import CurrentUserService from 'ember-osf-web/services/current-user';

export default class GithubProviderFile extends ProviderFile {
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
            return queryResult.map(fileModel => new GithubFile(this.currentUser, fileModel));
        } catch (e) {
            return this.handleFetchError(e);
        }
    }

    get userCanMoveToHere() {
        return false;
    }
}
