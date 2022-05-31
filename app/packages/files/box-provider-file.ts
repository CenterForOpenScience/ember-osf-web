import { inject as service } from '@ember/service';

import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { FileSortKey } from 'ember-osf-web/packages/files/file';
import FileProviderModel from 'ember-osf-web/models/file-provider';
import BoxFile from 'ember-osf-web/packages/files/box-file';
import ProviderFile from 'ember-osf-web/packages/files/provider-file';
import CurrentUserService from 'ember-osf-web/services/current-user';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

export default class BoxProviderFile extends ProviderFile {
    providerHandlesVersioning = false;

    @service intl!: Intl;
    @service toast!: Toast;

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
            return queryResult.map(fileModel => new BoxFile(this.currentUser, fileModel));
        } catch (e) {
            const errorMessage = this.intl.t(
                'osf-components.file-browser.errors.load_file_list',
            );
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
            return [];
        }
    }
}
