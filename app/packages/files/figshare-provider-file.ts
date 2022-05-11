import { FileSortKey } from 'ember-osf-web/packages/files/file';
import FileProviderModel from 'ember-osf-web/models/file-provider';
import FigshareFile from 'ember-osf-web/packages/files/figshare-file';
import ProviderFile from 'ember-osf-web/packages/files/provider-file';
import CurrentUserService from 'ember-osf-web/services/current-user';

export default class FigshareProviderFile extends ProviderFile {
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
        return queryResult.map(fileModel => new FigshareFile(this.currentUser, fileModel));
    }

    get currentUserPermission(): string {
        return 'read';
    }
}
