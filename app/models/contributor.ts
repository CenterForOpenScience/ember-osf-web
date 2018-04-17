import { attr, belongsTo } from '@ember-decorators/data';
import Node from './node';
import OsfModel from './osf-model';
import User from './user';

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 contributors. Primarily accessed via relationship fields.
 *
 * @class Contributor
 */
export default class Contributor extends OsfModel {
    @attr('fixstring') permission: string;
    @attr('boolean') bibliographic: boolean;

    @attr('fixstring') unregisteredContributor: string;
    @attr('number') index: number;
    @attr('fixstring') fullName: string;
    @attr('fixstring') email: string;
    @attr('boolean') sendEmail: boolean;

    @belongsTo('user') user: User;

    @belongsTo('node', { inverse: 'contributors' }) node: Node;
}

declare module 'ember-data' {
    interface ModelRegistry {
        'contributor': Contributor;
    }
}
