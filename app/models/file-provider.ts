import { attr, belongsTo, hasMany } from '@ember-decorators/data';
import FileItemMixin from 'ember-osf-web/mixins/file-item';
import OsfModel from './osf-model';

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 file providers. Primarily used in relationship fields.
 * This model is used for basic file provider metadata. To interact with file contents directly, see the `file-manager`
 * service.
 * For field and usage information, see:
 * * https://api.osf.io/v2/docs/#!/v2/Node_Providers_List_GET
 * * https://api.osf.io/v2/docs/#!/v2/Node_Provider_Detail_GET
 * * https://api.osf.io/v2/docs/#!/v2/Registration_Providers_List_GET
 * @class FileProvider
 */
export default class FileProvider extends OsfModel.extend(FileItemMixin) {
    @attr('fixstring') name; // eslint-disable-line no-restricted-globals
    @attr('fixstring') kind;
    @attr('string') path;
    @attr('fixstring') provider;
    @hasMany('file') files;
    @belongsTo('node') node;

    isProvider = true;
}

declare module 'ember-data' {
    interface ModelRegistry {
        'file-provider': FileProvider;
    }
}
