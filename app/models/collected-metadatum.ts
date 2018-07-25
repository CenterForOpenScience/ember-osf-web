import { attr, belongsTo } from '@ember-decorators/data';
import { computed } from '@ember-decorators/object';
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

const Validations = buildValidations({
    collectedType: [
        validator('presence', true),
    ],
    status: [
        validator('presence', true),
    ],
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
    @attr('string') collectedType!: string;
    @attr('string') status!: string; // eslint-disable-line no-restricted-globals
    @attr('subjects') subjects!: SubjectRef[][];

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
}

declare module 'ember-data' {
    interface ModelRegistry {
        'collected-metadatum': CollectedMetadatum;
    }
}
