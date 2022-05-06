import { tracked } from '@glimmer/tracking';
import FileProviderModel from 'ember-osf-web/models/file-provider';
import { Permission } from 'ember-osf-web/models/osf-model';
import CurrentUserService from 'ember-osf-web/services/current-user';

export default abstract class ProviderFile {
    @tracked fileModel: FileProviderModel;
    @tracked totalFileCount = 0;
    userCanDownloadAsZip = true;

    currentUser: CurrentUserService;

    constructor(currentUser: CurrentUserService, fileModel: FileProviderModel) {
        this.currentUser = currentUser;
        this.fileModel = fileModel;
    }

    get isFile() {
        return false;
    }

    get isFolder() {
        return true;
    }

    get currentUserPermission(): string {
        if (this.fileModel.target.get('currentUserPermissions').includes(Permission.Write)) {
            return 'write';
        }
        return 'read';
    }

    get userCanMoveToHere() {
        return this.currentUserPermission === 'write';
    }

    get name() {
        return this.fileModel.name;
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
}
