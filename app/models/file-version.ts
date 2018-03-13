import DS from 'ember-data';
import OsfModel from './osf-model';

const { attr } = DS;

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 file versions. Primarily used in relationship fields.
 * This model is used for basic file version metadata. To interact with file contents directly, see the `file-manager`
 * service.
 * For field and usage information, see:
 * * https://api.osf.io/v2/docs/#!/v2/File_Versions_List_GET
 * * https://api.osf.io/v2/docs/#!/v2/File_Version_Detail_GET
 * @class FileVersion
 */
export default class FileVersion extends OsfModel.extend({
    size: attr('number'),
    dateCreated: attr('date'),
    contentType: attr('fixstring'),
}) {}

declare module 'ember-data' {
    interface ModelRegistry {
        'file-version': FileVersion;
    }
}
