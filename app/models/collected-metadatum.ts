import { attr, belongsTo } from '@ember-decorators/data';
import { computed } from '@ember-decorators/object';
import { computed as iComputed } from '@ember/object';
import { alias as iAlias } from '@ember/object/computed';
import { buildValidations, validator } from 'ember-cp-validations';

import tuple from 'ember-osf-web/utils/tuple';

import Collection, { ChoicesFields } from './collection';
import Guid from './guid';
import OsfModel from './osf-model';
import { SubjectRef } from './taxonomy';
import User from './user';

export interface DisplaySubject {
    text: string;
    path: string;
}

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
    @attr('subjects') subjects!: SubjectRef[][];
    @attr('string') volume?: string;

    @belongsTo('collection') collection!: Collection;
    @belongsTo('guid') guid!: Guid;
    @belongsTo('user') creator!: User;

    @computed('subjects')
    get displaySubjects(): DisplaySubject[] {
        // returns a list of unique subjects and its path for display and filtering
        const displaySubjects: DisplaySubject[] = [];
        this.subjects.forEach(subjectPathArray => {
            let index = 0;
            const includedTester = (element: DisplaySubject) => element.text === subjectPathArray[index].text;
            for (index = 0; index < subjectPathArray.length; index++) {
                // Only append the subjects if they are not already included in the list
                if (!displaySubjects.some(includedTester)) {
                    const { text } = subjectPathArray[index];
                    const path = ['', ...subjectPathArray.slice(0, index + 1).map(item => item.text)].join('|');
                    displaySubjects.push({ text, path });
                }
            }
        });
        return displaySubjects;
    }

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
