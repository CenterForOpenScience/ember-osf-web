import { attr, belongsTo, hasMany } from '@ember-decorators/data';
import { computed } from '@ember-decorators/object';
import { computed as iComputed } from '@ember/object';
import { alias as iAlias } from '@ember/object/computed';
import { buildValidations, validator } from 'ember-cp-validations';
import DS from 'ember-data';

import tuple from 'ember-osf-web/utils/tuple';

import Collection, { ChoicesFields } from './collection';
import Guid from './guid';
import OsfModel from './osf-model';
import SubjectModel from './subject';
import User from './user';

export const choiceFields = tuple(
    'collectedType',
    'issue',
    'programArea',
    'status',
    'volume',
);

const Validations = buildValidations({
    ...choiceFields.reduce((acc, val) => {
        const disabled = iComputed('model.displayChoiceFields.[]', function(): boolean {
            return !this.model.displayChoiceFields.includes(val);
        });

        return {
            ...acc,
            [val]: [
                validator('presence', {
                    presence: true,
                    disabled,
                }),
                validator('inclusion', {
                    in: iAlias(`model.collection.${val}Choices`),
                    disabled,
                }),
            ],
        };
    }, {}),
    subjects: [
        validator('presence', {
            presence: true,
            minLength: 1,
            messageKey: 'validationErrors.min_subjects',
        }),
        validator('array', {
            minLength: 1,
            messageKey: 'validationErrors.min_subjects',
        }),
    ],
});

export default class CollectedMetadatumModel extends OsfModel.extend(Validations) {
    @attr('string') collectedType?: string;
    @attr('string') issue?: string;
    @attr('string') programArea?: string;
    @attr('string') status?: string;
    @attr('string') volume?: string;

    @belongsTo('collection') collection!: Collection;
    @belongsTo('guid') guid!: Guid;
    @belongsTo('user') creator!: User;

    @hasMany('subject', { inverse: null })
    subjects!: DS.PromiseManyArray<SubjectModel> | SubjectModel[];

    @computed('collection.displayChoicesFields.[]')
    get displayChoiceFields() {
        return choiceFields
            .filter(field => this.collection
                .get('displayChoicesFields')
                .includes(`${field}Choices` as ChoicesFields));
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'collected-metadatum': CollectedMetadatumModel;
    } // eslint-disable-line semi
}
