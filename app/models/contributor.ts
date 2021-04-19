import { AsyncBelongsTo, AsyncHasMany, attr, belongsTo } from '@ember-data/model';
import { not } from '@ember/object/computed';
import { buildValidations, validator } from 'ember-cp-validations';

import DraftRegistrationModel from './draft-registration';
import NodeModel from './node';
import OsfModel, { Permission } from './osf-model';
import UserModel from './user';

export interface ModelWithBibliographicContributors extends OsfModel {
    bibliographicContributors: AsyncHasMany<ContributorModel> & ContributorModel[];
}

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
    @attr('string') sendEmail!: 'default' | 'preprint' | 'false';

    // Write-only attributes
    @attr('fixstring') fullName!: string;
    @attr('fixstring') email!: string;

    @belongsTo('user', { inverse: 'contributors' })
    users!: AsyncBelongsTo<UserModel>;

    @belongsTo('node', { inverse: 'contributors', polymorphic: true })
    node!: AsyncBelongsTo<NodeModel>;

    @belongsTo('draft-registration', { inverse: 'contributors' })
    draftRegistration!: AsyncBelongsTo<DraftRegistrationModel>;

    isUnregistered: boolean = false;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        contributor: ContributorModel;
    } // eslint-disable-line semi
}
