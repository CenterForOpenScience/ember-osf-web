import { attr, belongsTo } from '@ember-decorators/data';
import { computed } from '@ember-decorators/object';
import { computed as iComputed } from '@ember/object';
import { alias as iAlias } from '@ember/object/computed';
import { buildValidations, validator } from 'ember-cp-validations';
import Collection from './collection';
import Guid from './guid';
import OsfModel from './osf-model';
import { SubjectRef } from './taxonomy';
import User from './user';

export interface DisplaySubject {
    text: string;
    path: string;
}

export const choiceFields: Array<keyof CollectedMetadatum> = [
    'collectedType',
    'issue',
    'programArea',
    'status',
    'volume',
];

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

export default class CollectedMetadatum extends OsfModel.extend(Validations) {
    @attr('string') collectedType?: string;
    @attr('string') issue?: string;
    @attr('string') programArea?: string;
    @attr('string') status?: string;
    @attr('subjects') subjects!: SubjectRef[][];
    @attr('string') volume?: string;

    @belongsTo('collection') collection!: Collection;
    @belongsTo('guid') guid!: Guid;
    @belongsTo('user') creator!: User;

    @computed('subjects')
    get displaySubjects(): DisplaySubject[] {
        return this.subjects.map(subject => {
            const names = subject.mapBy('text');

            return {
                text: names.get('lastObject'),
                path: ['', ...names].join('|'),
            };
        });
    }

    @computed('collection.displayChoicesFields.[]')
    get displayChoiceFields(): Array<keyof CollectedMetadatum> {
        return choiceFields
            .filter(field => this.collection
                .get('displayChoicesFields')
                .includes(`${field}Choices` as keyof Collection));
    }
}

declare module 'ember-data' {
    interface ModelRegistry {
        'collected-metadatum': CollectedMetadatum;
    }
}
