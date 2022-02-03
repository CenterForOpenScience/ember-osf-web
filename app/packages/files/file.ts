import { tracked } from '@glimmer/tracking';
import FileModel from 'ember-osf-web/models/file';
import NodeModel from 'ember-osf-web/models/node';

export enum FileSortKey {
    AscDateModified = 'date_modified',
    DescDateModified = '-date_modified',
    AscName = 'name',
    DescName = 'name',
}

export default abstract class File {
    @tracked fileModel: FileModel;

    constructor(fileModel: FileModel) {
        this.fileModel = fileModel;
    }

    get isFile() {
        return this.fileModel.isFile;
    }

    get isFolder() {
        return this.fileModel.isFolder;
    }

    get currentUserPermission() {
        return 'read';
    }

    get name() {
        return this.fileModel.name;
    }

    get links() {
        return this.fileModel.links;
    }

    get dateModified() {
        return this.fileModel.dateModified;
    }

    async createFolder(newFolderName: string) {
        if (this.fileModel.isFolder) {
            await this.fileModel.createFolder(newFolderName);
        }
    }

    async getFolderItems(page: number, sort: FileSortKey, filter: string ) {
        if (this.fileModel.isFolder) {
            const queryResult = await this.fileModel.queryHasMany('files',
                {
                    page,
                    sort,
                    filter,
                });
            return queryResult.map(fileModel => Reflect.construct(this.constructor, [fileModel]));
        }
        return [];
    }


    async updateContents(data: string) {
        await this.fileModel.updateContents(data);
    }

    async rename(newName: string, conflict = 'replace') {
        await this.fileModel.rename(newName, conflict);
    }

    async move(node: NodeModel) {
        await this.fileModel.move(node);
    }

    async delete() {
        await this.fileModel.delete();
    }
}
