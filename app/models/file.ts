import { task } from 'ember-concurrency';
import DS from 'ember-data';
import FileItemMixin from 'ember-osf-web/mixins/file-item';
import authenticatedAJAX from 'ember-osf-web/utils/ajax-helpers';
import Node from './node';
import OsfModel from './osf-model';

const { attr, belongsTo, hasMany } = DS;

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 files. This model may be used with one of several API endpoints. It may be queried directly,
 *  or (more commonly) accessed via relationship fields.
 * This model is used for basic file metadata. To interact with file contents directly, see the `file-manager` service.
 * For field and usage information, see:
 * * https://api.osf.io/v2/docs/#!/v2/File_Detail_GET
 * * https://api.osf.io/v2/docs/#!/v2/Node_Files_List_GET
 * * https://api.osf.io/v2/docs/#!/v2/Node_File_Detail_GET
 * * https://api.osf.io/v2/docs/#!/v2/Registration_Files_List_GET
 * * https://api.osf.io/v2/docs/#!/v2/Registration_File_Detail_GET
 * @class File
 */
export default class File extends OsfModel.extend(FileItemMixin, {
    name: attr('fixstring'),
    kind: attr('fixstring'),
    guid: attr('fixstring'),
    path: attr('string'),
    size: attr('number'),
    currentVersion: attr('number'),
    provider: attr('fixstring'),
    materializedPath: attr('string'),
    lastTouched: attr('date'),
    dateModified: attr('date'),
    dateCreated: attr('date'),
    extra: attr('object'),
    tags: attr('array'),
    checkout: attr('fixstring'),

    parentFolder: belongsTo('file', { inverse: 'files' }),

    // Folder attributes
    files: hasMany('file', { inverse: 'parentFolder' }),

    // File attributes
    versions: hasMany('file-version'),
    comments: hasMany('comment'),
    // TODO: In the future apiv2 may also need to support this pointing at nodes OR registrations
    node: belongsTo('node'),
    user: belongsTo('user'),
    _isFileModel: true,

}) {
    getContents = task(function* (this: File) {
        const data = yield authenticatedAJAX({
            url: this.get('links.download'),
            type: 'GET',
            data: {
                direct: true,
                mode: 'render',
            },
        });
        return data;
    });

    async rename(this: File, newName: string, conflict = 'replace'): Promise<null> {
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
