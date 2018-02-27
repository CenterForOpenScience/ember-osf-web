import DS from 'ember-data';
import OsfModel from './osf-model';
import FileItemMixin from 'ember-osf-web/mixins/file-item';
/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 file providers. Primarily used in relationship fields.
 * This model is used for basic file provider metadata. To interact with file contents directly, see the `file-manager` service.
 * For field and usage information, see:
 * * https://api.osf.io/v2/docs/#!/v2/Node_Providers_List_GET
 * * https://api.osf.io/v2/docs/#!/v2/Node_Provider_Detail_GET
 * * https://api.osf.io/v2/docs/#!/v2/Registration_Providers_List_GET
 * @class FileProvider
 */
export default class FileProvider extends OsfModel.extend(FileItemMixin, {
    name: DS.attr('fixstring'),
    kind: DS.attr('fixstring'),
    path: DS.attr('string'),
    provider: DS.attr('fixstring'),
    files: DS.hasMany('file'),
    node: DS.belongsTo('node'),

    isProvider: true,
}) {
  // normal class body definition here
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data' {
    interface ModelRegistry {
        'file-provider': FileProvider;
    }
}
