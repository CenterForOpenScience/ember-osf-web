import { attr, belongsTo, hasMany } from '@ember-decorators/data';
import FileItemMixin from 'ember-osf-web/mixins/file-item';
import File from './file';
import Node from './node';
import OsfModel from './osf-model';

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 file providers. Primarily used in relationship fields.
 * This model is used for basic file provider metadata. To interact with file contents directly, see the `file-manager`
 * service.
 *
 * @class FileProvider
 */
export default class FileProvider extends OsfModel.extend(FileItemMixin) {
    @attr('fixstring') name: string; // eslint-disable-line no-restricted-globals
    @attr('fixstring') kind: string;
    @attr('string') path: string;
    @attr('fixstring') provider: string;
    @hasMany('file') files: File[];
    @belongsTo('node') node: Node;

    isProvider = true;
}

declare module 'ember-data' {
    interface ModelRegistry {
        'file-provider': FileProvider;
    }
}
