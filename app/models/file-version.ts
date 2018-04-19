import { attr } from '@ember-decorators/data';
import OsfModel from './osf-model';

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 file versions. Primarily used in relationship fields.
 * This model is used for basic file version metadata. To interact with file contents directly, see the `file-manager`
 * service.
 *
 * @class FileVersion
 */
export default class FileVersion extends OsfModel {
    @attr('number') size: number;
    @attr('date') dateCreated: Date;
    @attr('fixstring') contentType: string;
}

declare module 'ember-data' {
    interface ModelRegistry {
        'file-version': FileVersion;
    }
}
