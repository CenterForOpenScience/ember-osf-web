import { getOwner, setOwner } from '@ember/application';
import { inject as service } from '@ember/service';

import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { tracked } from '@glimmer/tracking';
import FileProviderModel from 'ember-osf-web/models/file-provider';
import { Permission } from 'ember-osf-web/models/osf-model';
import { FileSortKey } from 'ember-osf-web/packages/files/file';
import CurrentUserService from 'ember-osf-web/services/current-user';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import { ErrorDocument } from 'osf-api';
import ConfiguredStorageAddonModel, { ConnectedCapabilities, ConnectedOperationNames}
    from 'ember-osf-web/models/configured-storage-addon';

export default class ServiceProviderFile {
    @tracked fileModel: FileProviderModel;
    @tracked configuredStorageAddon: ConfiguredStorageAddonModel;
    @tracked totalFileCount = 0;
    userCanDownloadAsZip: boolean;
    providerHandlesVersioning: boolean;
    canMoveToThisProvider: boolean;
    parallelUploadsLimit = 2;

    currentUser: CurrentUserService;
    @service intl!: Intl;
    @service toast!: Toast;

    constructor(
        currentUser: CurrentUserService,
        fileModel: FileProviderModel,
        configuredStorageAddon: ConfiguredStorageAddonModel,
    ) {
        setOwner(this, getOwner(fileModel));
        this.currentUser = currentUser;
        this.fileModel = fileModel;
        this.configuredStorageAddon = configuredStorageAddon;
        this.userCanDownloadAsZip = configuredStorageAddon.connectedOperationNames
            .includes(ConnectedOperationNames.DownloadAsZip);
        this.providerHandlesVersioning = configuredStorageAddon.connectedOperationNames
            .includes(ConnectedOperationNames.HasRevisions);
        this.parallelUploadsLimit = configuredStorageAddon.concurrentUploads;
        this.canMoveToThisProvider = configuredStorageAddon.connectedOperationNames
            .includes(ConnectedOperationNames.CopyInto);
    }

    get id() {
        return this.fileModel.id;
    }

    get isFile() {
        return false;
    }

    get isFolder() {
        return true;
    }

    get currentUserPermission(): string {
        if (
            this.fileModel.target.get('currentUserPermissions').includes(Permission.Write) &&
            this.configuredStorageAddon.connectedCapabilities.includes(ConnectedCapabilities.Update)
        ) {
            return 'write';
        }
        return 'read';
    }

    get userCanUploadToHere() {
        return (
            this.currentUserPermission === 'write' &&
            this.fileModel.target.get('modelName') !== 'registration'
        );
    }

    get userCanMoveToHere() {
        return (
            this.currentUserPermission === 'write' &&
            this.canMoveToThisProvider &&
            this.fileModel.target.get('modelName') !== 'registration'
        );
    }

    get userCanDeleteFromHere() {
        return (
            this.isFolder &&
            this.currentUserPermission === 'write' &&
            this.fileModel.target.get('modelName') !== 'registration'
        );
    }

    get name() {
        return this.configuredStorageAddon.displayName;
    }

    get iconLocation() {
        return this.configuredStorageAddon.iconUrl;
    }

    get path() {
        return this.fileModel.path;
    }

    get links() {
        const links = this.fileModel.links;
        const uploadLink = new URL(links.upload as string);
        uploadLink.searchParams.set('zip', '');

        links.download = uploadLink.toString();
        return links;
    }

    async createFolder(newFolderName: string) {
        await this.fileModel.createFolder(newFolderName);
    }

    async getFolderItems(page: number, sort: FileSortKey, filter: string ) {
        if (this.fileModel.isFolder) {
            const queryResult = await this.fileModel.queryHasMany('files',
                {
                    page,
                    sort,
                    'filter[name]': filter,
                });
            this.totalFileCount = queryResult.meta.total;
            return queryResult.map(fileModel => Reflect.construct(this.constructor, [
                this.currentUser,
                fileModel,
                this.configuredStorageAddon,
            ]));
        }
        return [];
    }

    handleFetchError(e: ErrorDocument) {
        const errorMessage = this.intl.t(
            'osf-components.file-browser.errors.load_file_list',
        );
        captureException(e, { errorMessage });
        this.toast.error(getApiErrorMessage(e), errorMessage);
        return [];
    }
}
