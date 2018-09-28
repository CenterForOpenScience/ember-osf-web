import { attr, belongsTo, hasMany } from '@ember-decorators/data';
import DS from 'ember-data';
import BaseFileItem from './base-file-item';
import File from './file';
import Node from './node';

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
export default class FileProvider extends BaseFileItem {
    @attr('fixstring') name!: string;
    @attr('string') path!: string;
    @attr('fixstring') provider!: string;
    @hasMany('file') files!: DS.PromiseManyArray<File>;
    @belongsTo('node') node!: DS.PromiseObject<Node> & Node;

    // BaseFileItem override
    isProvider = true;
}

declare module 'ember-data' {
    interface ModelRegistry {
        'file-provider': FileProvider;
    }
}
