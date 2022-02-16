import { tracked } from '@glimmer/tracking';
import FileProviderModel from 'ember-osf-web/models/file-provider';

export default abstract class ProviderFile {
    @tracked fileModel: FileProviderModel;
    @tracked totalFileCount = 0;

    constructor(fileModel: FileProviderModel) {
        this.fileModel = fileModel;
    }

    get isFile() {
        return false;
    }

    get isFolder() {
        return true;
    }

    get currentUserPermission() {
        return 'read';
    }

    get name() {
        return this.fileModel.name;
    }

    get links() {
        const links = this.fileModel.links;
        links.download = `${links.upload}?zip=`;
        return links;
    }

    async createFolder(newFolderName: string) {
        await this.fileModel.createFolder(newFolderName);
    }
}
