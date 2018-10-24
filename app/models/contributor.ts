import { attr, belongsTo } from '@ember-decorators/data';
import { not } from '@ember/object/computed';
import { buildValidations, validator } from 'ember-cp-validations';
import DS from 'ember-data';
import defaultTo from 'ember-osf-web/utils/default-to';
import Node from './node';
import OsfModel, { Permission } from './osf-model';
import User from './user';

const Validations = buildValidations({
    fullName: [
        validator('presence', {
            presence: true,
            disabled: not('model.isUnregistered'),
        }),
        validator('length', {
            max: 186,
            min: 3,
        }),
    ],
    email: [
        validator('presence', {
            presence: true,
            disabled: not('model.isUnregistered'),
        }),
        validator('format', { type: 'email' }),
        validator('length', {
            max: 255,
        }),
    ],
});

export const permissions = Object.freeze(Object.values(Permission));

/**
 * Model for OSF APIv2 contributors. Primarily accessed via relationship fields.
 *
 * @class Contributor
 */
export default class Contributor extends OsfModel.extend(Validations) {
    @attr('fixstring') permission!: Permission;
    @attr('boolean') bibliographic!: boolean;

    @attr('fixstring') unregisteredContributor!: string;
    @attr('number') index!: number;
    @attr('fixstring') fullName!: string;
    @attr('fixstring') email!: string;
    @attr('string') sendEmail!: 'default' | 'preprint' | 'false';

    @belongsTo('user', { inverse: 'contributors' }) users!: DS.PromiseObject<User> & User;

    @belongsTo('node', { inverse: 'contributors', polymorphic: true }) node!: DS.PromiseObject<Node> & Node;

    isUnregistered: boolean = defaultTo(this.isUnregistered, false);
}

declare module 'ember-data' {
    interface ModelRegistry {
        contributor: Contributor;
    }
}
