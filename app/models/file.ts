import DS from 'ember-data';
import OsfModel from './osf-model';
import FileItemMixin from 'ember-osf-web/mixins/file-item';
import authenticatedAJAX from 'ember-osf-web/utils/ajax-helpers';

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
    name: DS.attr('fixstring'),
    kind: DS.attr('fixstring'),
    guid: DS.attr('fixstring'),
    path: DS.attr('string'),
    size: DS.attr('number'),
    currentVersion: DS.attr('number'),
    provider: DS.attr('fixstring'),
    materializedPath: DS.attr('string'),
    lastTouched: DS.attr('date'),
    dateModified: DS.attr('date'),
    dateCreated: DS.attr('date'),
    extra: DS.attr('object'),
    tags: DS.attr('array'),
    checkout: DS.attr('fixstring'),

    parentFolder: DS.belongsTo('file', { inverse: 'files' }),

    // Folder attributes
    files: DS.hasMany('file', { inverse: 'parentFolder' }),

    // File attributes
    versions: DS.hasMany('file-version'),
    comments: DS.hasMany('comment'),
    node: DS.belongsTo('node'), // TODO: In the future apiv2 may also need to support this pointing at nodes OR registrations
    user: DS.belongsTo('user'),
    _isFileModel: true,

}) {
    // normal class body definition here
    rename = function(newName: string, conflict = 'replace'): Promise<null> {
        return authenticatedAJAX({
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
        }).done((response) => {
            this.set('name', response.data.attributes.name);
        });
    };
    getGuid = function(): Promise<any> {
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
    };
    getContents = function(): Promise<object> {
        return authenticatedAJAX({
            url: this.get('links.download'),
            type: 'GET',
            data: {
                direct: true,
                mode: 'render',
            },
        });
    };
    updateContents = function(data: object): Promise<null> {
        return authenticatedAJAX({
            url: this.get('links.upload'),
            type: 'PUT',
            xhrFields: { withCredentials: true },
            data,
        }).then(() => this.reload());
    };
    move = function(node: Node): Promise<null> {
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
    };
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data' {
    interface ModelRegistry {
        'file': File;
    }
}
