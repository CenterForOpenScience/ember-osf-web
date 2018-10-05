import { attr, hasMany } from '@ember-decorators/data';
import { computed } from '@ember-decorators/object';
import DS from 'ember-data';
import Node from './node';
import OsfModel from './osf-model';
import Registration from './registration';
import User from './user';

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 institutions. This model may be used with one of several API endpoints. It may be queried
 * directly, or accessed via relationship fields.
 *
 * @class Institution
 */
export default class Institution extends OsfModel {
    @attr('string') name!: string;
    @attr('fixstring') description!: string;
    @attr('string') logoPath!: string;
    @attr('string') authUrl!: string;
    @attr('object') assets!: any;
    @hasMany('user', { inverse: 'institutions' }) users!: DS.PromiseManyArray<User>;
    @hasMany('node', { inverse: 'affiliatedInstitutions' }) nodes!: DS.PromiseManyArray<Node>;
    @hasMany('registration', { inverse: 'affiliatedInstitutions' }) registrations!: DS.PromiseManyArray<Registration>;

    @computed('assets', 'id')
    get logoUrl(this: Institution): string {
        let assetsUrl = '';
        if (this.assets) {
            const { logo } = this.assets;
            assetsUrl = logo;
        } else {
            assetsUrl = `/static/img/institutions/shields-rounded-corners/${this.id}-shield-rounded-corners.png`;
        }
        return assetsUrl;
    }
}

declare module 'ember-data' {
    interface ModelRegistry {
        'institution': Institution;
    }
}
