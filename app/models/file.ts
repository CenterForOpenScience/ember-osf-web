import { attr, belongsTo, hasMany } from '@ember-decorators/data';
import DS from 'ember-data';
import { Link } from 'jsonapi-typescript';

import getHref from 'ember-osf-web/utils/get-href';

import BaseFileItem from './base-file-item';
import CommentModel from './comment';
import FileVersionModel from './file-version';
import NodeModel from './node';
import { OsfLinks } from './osf-model';
import UserModel from './user';

export interface FileLinks extends OsfLinks {
    info: Link;
    move: Link;
    upload: Link;
    delete: Link;

    // only for files
    download?: Link;

    // only for folders
    new_folder?: Link; // eslint-disable-line camelcase
}

export default class FileModel extends BaseFileItem {
    @attr() links!: FileLinks;
    @attr('fixstring') name!: string;
    @attr('fixstring') guid!: string;
    @attr('string') path!: string;
    @attr('number') size!: number;
    @attr('number') currentVersion!: number;
    @attr('fixstring') provider!: string;
    @attr('string') materializedPath!: string;
    @attr('date') lastTouched!: Date;
    @attr('date') dateModified!: Date;
    @attr('date') dateCreated!: Date;
    @attr('object') extra!: any;
    @attr('fixstringarray') tags!: string[];
    @attr('fixstring') checkout!: string;

    @belongsTo('file', { inverse: 'files' })
    parentFolder!: DS.PromiseObject<FileModel> & FileModel;

    // Folder attributes
    @hasMany('file', { inverse: 'parentFolder' })
    files!: DS.PromiseManyArray<FileModel>;

    // File attributes
    @hasMany('file-version')
    versions!: DS.PromiseManyArray<FileVersionModel>;

    @hasMany('comment', { inverse: null })
    comments!: DS.PromiseManyArray<CommentModel>;

    // TODO: In the future apiv2 may also need to support this pointing at nodes OR registrations
    @belongsTo('node')
    node!: DS.PromiseObject<NodeModel> & NodeModel;

    @belongsTo('user')
    user!: DS.PromiseObject<UserModel> & UserModel;

    // BaseFileItem override
    isFileModel = true;

    isSelected = false;

    flash: object | null = null;

    getContents(): Promise<object> {
        if (this.isFile) {
            return this.currentUser.authenticatedAJAX({
                url: getHref(this.links.download!),
                type: 'GET',
                data: {
                    direct: true,
                    mode: 'render',
                },
            });
        }
        return Promise.reject(Error('Can only get the contents of files.'));
    }

    async rename(newName: string, conflict = 'replace'): Promise<void> {
        const { data } = await this.currentUser.authenticatedAJAX({
            url: getHref(this.links.upload),
            type: 'POST',
            xhrFields: {
                withCredentials: true,
            },
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                action: 'rename',
                rename: newName,
                conflict,
            }),
        });

        this.set('name', data.attributes.name);
    }

    getGuid(): Promise<any> {
        return this.store.findRecord(
            (this.constructor as typeof FileModel).modelName,
            this.id,
            {
                reload: true,
                adapterOptions: {
                    query: {
                        create_guid: 1,
                    },
                },
            },
        );
    }

    updateContents(data: string): Promise<null> {
        return this.currentUser.authenticatedAJAX({
            url: getHref(this.links.upload),
            type: 'PUT',
            xhrFields: { withCredentials: true },
            data,
        }).then(() => this.reload());
    }

    move(node: NodeModel): Promise<null> {
        return this.currentUser.authenticatedAJAX({
            url: getHref(this.links.move),
            type: 'POST',
            xhrFields: { withCredentials: true },
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                action: 'move',
                path: '/',
                resource: node.id,
            }),
        }).then(() => this.reload());
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        file: FileModel;
    } // eslint-disable-line semi
}
