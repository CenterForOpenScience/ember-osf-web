import { attr, belongsTo, hasMany, AsyncBelongsTo, AsyncHasMany } from '@ember-data/model';
import { assert } from '@ember/debug';
import { Link } from 'jsonapi-typescript';

import { FileReference } from 'ember-osf-web/packages/registration-schema';
import getHref from 'ember-osf-web/utils/get-href';

import AbstractNodeModel from './abstract-node';
import BaseFileItem, { BaseFileLinks } from './base-file-item';
import CommentModel from './comment';
import DraftNode from './draft-node';
import FileVersionModel from './file-version';

export interface FileLinks extends BaseFileLinks {
    info: Link;
    move: Link;
    delete: Link;
    html: Link;

    // only for files
    download?: Link;
    render?: Link;
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
    @attr('boolean') currentUserHasViewed!: boolean;

    @belongsTo('file', { inverse: 'files' })
    parentFolder!: AsyncBelongsTo<FileModel> & FileModel;

    // Folder attributes
    @hasMany('file', { inverse: 'parentFolder' })
    files!: AsyncHasMany<FileModel>;

    // File attributes
    @hasMany('file-version')
    versions!: AsyncHasMany<FileVersionModel>;

    @hasMany('comment', { inverse: null })
    comments!: AsyncHasMany<CommentModel>;

    @belongsTo('abstract-node', { polymorphic: true })
    target!: (AsyncBelongsTo<AbstractNodeModel> & AbstractNodeModel) | (AsyncBelongsTo<DraftNode> & DraftNode);

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

    toFileReference(): FileReference {
        return {
            file_id: this.id,
            file_name: this.name,
            file_urls: {
                html: (this.links.html as string),
                download: (this.links.download as string),
            },
            file_hashes: {
                sha256: this.extra.hashes.sha256,
            },
        };
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

    move(node: AbstractNodeModel, path: string, provider: string, options?: { conflict: string }): Promise<null> {
        return this.currentUser.authenticatedAJAX({
            url: getHref(this.links.move),
            type: 'POST',
            xhrFields: { withCredentials: true },
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                action: 'move',
                path,
                provider,
                resource: node.id,
                ...options,
            }),
        }).then(() => this.reload());
    }

    copy(node: AbstractNodeModel, path: string, provider: string, options?: { conflict: string }): Promise<null> {
        return this.currentUser.authenticatedAJAX({
            url: getHref(this.links.move),
            type: 'POST',
            xhrFields: { withCredentials: true },
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                action: 'copy',
                path,
                provider,
                resource: node.id,
                ...options,
            }),
        }).then(() => this.reload());
    }

    delete(): Promise<null> {
        assert('links.delete is required to remove a file or folder', Boolean(this.links.delete));
        return this.currentUser.authenticatedAJAX({
            url: getHref(this.links.delete),
            type: 'DELETE',
            xhrFields: { withCredentials: true },
        });
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        file: FileModel;
    } // eslint-disable-line semi
}
