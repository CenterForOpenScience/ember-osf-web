import { getOwner, setOwner } from '@ember/application';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';
import FileModel from 'ember-osf-web/models/file';
import NodeModel from 'ember-osf-web/models/node';
import { Permission } from 'ember-osf-web/models/osf-model';
import CurrentUserService from 'ember-osf-web/services/current-user';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';


export enum FileSortKey {
    AscDateModified = 'date_modified',
    DescDateModified = '-date_modified',
    AscName = 'name',
    DescName = '-name',
}

// Waterbutler file version
export interface WaterButlerRevision {
    id: string;
    type: 'file_versions';
    attributes: {
        extra: {
            downloads: number,
            hashes: {
                md5: string,
                sha256: string,
            },
            user: {
                name: string,
                url: string,
            },
        },
        version: number,
        modified: Date,
        modified_utc: Date,
        versionIdentifier: 'version',
    };
}

export default abstract class File {
    @tracked fileModel: FileModel;
    @tracked totalFileCount = 0;
    @tracked waterButlerRevisions?: WaterButlerRevision[];
    userCanDownloadAsZip = true;
    shouldShowTags = false;
    shouldShowRevisions = true;
    providerHandlesVersioning = true;

    currentUser: CurrentUserService;
    @service intl!: Intl;
    @service toast!: Toast;


    constructor(currentUser: CurrentUserService, fileModel: FileModel) {
        setOwner(this, getOwner(fileModel));
        this.currentUser = currentUser;
        this.fileModel = fileModel;
    }

    get isFile() {
        return this.fileModel.isFile;
    }

    get isFolder() {
        return this.fileModel.isFolder;
    }

    get showAsUnviewed() {
        return !this.fileModel.currentUserHasViewed;
    }

    get currentUserPermission(): string {
        if (this.fileModel.target.get('currentUserPermissions').includes(Permission.Write)) {
            return 'write';
        }
        return 'read';
    }

    get currentUserCanDelete() {
        return (this.fileModel.target.get('modelName') !== 'registration' && this.currentUserPermission === 'write');
    }

    get name() {
        return this.fileModel.name;
    }

    get id() {
        return this.fileModel.id;
    }

    get path() {
        return this.fileModel.path;
    }

    get links() {
        const links = this.fileModel.links;
        if (this.isFolder) {
            const uploadLink = new URL(links.upload as string);
            uploadLink.searchParams.set('zip', '');

            links.download = uploadLink.toString();
        }
        return links;
    }

    get userCanEditMetadata() {
        return this.fileModel.target.get('currentUserPermissions').includes(Permission.Write);
    }

    get dateModified() {
        return this.fileModel.dateModified;
    }

    get userCanMoveToHere() {
        return (
            this.currentUserPermission === 'write' &&
            this.fileModel.target.get('modelName') !== 'registration' &&
            this.isFolder
        );
    }

    get userCanUploadToHere() {
        return (
            this.currentUserPermission === 'write' &&
            this.fileModel.target.get('modelName') !== 'registration' &&
            this.isFolder
        );
    }

    get userCanDeleteFromHere() {
        return (
            this.isFolder &&
            this.currentUserPermission === 'write' &&
            this.fileModel.target.get('modelName') !== 'registration'
        );
    }

    async createFolder(newFolderName: string) {
        if (this.fileModel.isFolder) {
            await this.fileModel.createFolder(newFolderName);
        }
    }

    async getFolderItems(page: number, sort: FileSortKey, filter: string ) {
        if (this.fileModel.isFolder) {
            try {
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
                ]));
            } catch (e) {
                const errorMessage = this.intl.t(
                    'osf-components.file-browser.errors.load_file_list',
                );
                captureException(e, { errorMessage });
                this.toast.error(getApiErrorMessage(e), errorMessage);
                return [];
            }
        }
        return [];
    }

    async updateContents(data: string) {
        await this.fileModel.updateContents(data);
    }

    async rename(newName: string, conflict = 'replace') {
        await this.fileModel.rename(newName, conflict);
    }

    @task
    @waitFor
    async move(node: NodeModel, path: string, provider: string, options?: { conflict: string }) {
        return await this.fileModel.move(node, path, provider, options);
    }

    @task
    @waitFor
    async copy(node: NodeModel, path: string, provider: string, options?: { conflict: string }) {
        return await this.fileModel.copy(node, path, provider, options);
    }

    @task
    @waitFor
    async delete() {
        return await this.fileModel.delete();
    }

    @task
    @waitFor
    async getRevisions() {
        const revisionsLink = new URL(this.links.upload as string);
        revisionsLink.searchParams.set('revisions', '');

        const responseObject = await this.currentUser.authenticatedAJAX({ url: revisionsLink.toString() });
        this.waterButlerRevisions = responseObject.data;
        return this.waterButlerRevisions;
    }
}
