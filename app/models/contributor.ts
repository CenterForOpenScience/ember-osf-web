import { attr, belongsTo } from '@ember-decorators/data';
import OsfModel from './osf-model';

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 contributors. Primarily accessed via relationship fields.
 * For field and usage information, see:
 * * https://api.osf.io/v2/docs/#!/v2/Node_Contributors_List_GET
 * @class Contributor
 */
export default class Contributor extends OsfModel {
    @attr('fixstring') permission;
    @attr('boolean') bibliographic;

    @attr('fixstring') unregisteredContributor;
    @attr('number') index;
    @attr('fixstring') fullName;
    @attr('fixstring') email;
    @attr('boolean') sendEmail;

    @belongsTo('user') user;

    @belongsTo('node', { inverse: 'contributors' }) node;
}

declare module 'ember-data' {
    interface ModelRegistry {
        'contributor': Contributor;
    }
}
