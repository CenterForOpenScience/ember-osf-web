import { attr, belongsTo, hasMany } from '@ember-decorators/data';
import authenticatedAJAX from 'ember-osf-web/utils/ajax-helpers';
import BaseFileItem from './base-file-item';
import Comment from './comment';
import FileVersion from './file-version';
import Node from './node';
import User from './user';

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 files. This model may be used with one of several API endpoints. It may be queried directly,
 *  or (more commonly) accessed via relationship fields.
 * This model is used for basic file metadata. To interact with file contents directly, see the `file-manager` service.
 *
 * @class File
 */
export default class File extends BaseFileItem {
    @attr('fixstring') name: string; // eslint-disable-line no-restricted-globals
    @attr('fixstring') guid: string;
    @attr('string') path: string;
    @attr('number') size: number;
    @attr('number') currentVersion: number;
    @attr('fixstring') provider: string;
    @attr('string') materializedPath: string;
    @attr('date') lastTouched: Date;
    @attr('date') dateModified: Date;
    @attr('date') dateCreated: Date;
    @attr('object') extra: any;
    @attr('array') tags: string[];
    @attr('fixstring') checkout: string;

    @belongsTo('file', { inverse: 'files' }) parentFolder: File;

    // Folder attributes
    @hasMany('file', { inverse: 'parentFolder' }) files: File[];

    // File attributes
    @hasMany('file-version') versions: FileVersion[];
    @hasMany('comment') comments: Comment[];
    // TODO: In the future apiv2 may also need to support this pointing at nodes OR registrations
    @belongsTo('node') node: Node;
    @belongsTo('user') user: User;

    // BaseFileItem override
    isFileModel = true;

    getContents(this: File): Promise<object> {
        return authenticatedAJAX({
            url: this.get('links.download'),
            type: 'GET',
            data: {
                direct: true,
                mode: 'render',
            },
        });
    }

    async rename(this: File, newName: string, conflict = 'replace'): Promise<void> {
        const { data } = await authenticatedAJAX({
            url: this.get('links.upload'),
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

    getGuid(this: File): Promise<any> {
        return this.store.findRecord(
            this.constructor.modelName,
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

    updateContents(this: File, data: object): Promise<null> {
        return authenticatedAJAX({
            url: this.get('links.upload'),
            type: 'PUT',
            xhrFields: { withCredentials: true },
            data,
        }).then(() => this.reload());
    }

    move(this: File, node: Node): Promise<null> {
        return authenticatedAJAX({
            url: this.get('links.move'),
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

declare module 'ember-data' {
    interface ModelRegistry {
        'file': File;
    }
}
