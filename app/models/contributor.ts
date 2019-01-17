import { attr, belongsTo } from '@ember-decorators/data';
import { not } from '@ember/object/computed';
import { buildValidations, validator } from 'ember-cp-validations';
import DS from 'ember-data';

import defaultTo from 'ember-osf-web/utils/default-to';

import NodeModel from './node';
import OsfModel, { Permission } from './osf-model';
import UserModel from './user';

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

export default class ContributorModel extends OsfModel.extend(Validations) {
    @attr('fixstring') permission!: Permission;
    @attr('boolean') bibliographic!: boolean;
    @attr('fixstring') unregisteredContributor?: string;
    @attr('number') index!: number;
    @attr('fixstring') fullName!: string;
    @attr('fixstring') email!: string;
    @attr('string') sendEmail!: 'default' | 'preprint' | 'false';

    @belongsTo('user', { inverse: 'contributors' })
    users!: DS.PromiseObject<UserModel> & UserModel;

    @belongsTo('node', { inverse: 'contributors', polymorphic: true })
    node!: DS.PromiseObject<NodeModel> & NodeModel;

    isUnregistered: boolean = defaultTo(this.isUnregistered, false);
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        contributor: ContributorModel;
    } // eslint-disable-line semi
}
