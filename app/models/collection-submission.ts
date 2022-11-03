import { belongsTo, hasMany, AsyncHasMany, attr } from '@ember-data/model';
import { computed } from '@ember/object';
import { alias as iAlias } from '@ember/object/computed';
import { buildValidations, validator } from 'ember-cp-validations';

import tuple from 'ember-osf-web/utils/tuple';

import Collection, { ChoicesFields } from './collection';
import CollectionSubmissionAction, {
    CollectionSubmissionActionTrigger,
} from './collection-submission-action';
import Node from './node';
import OsfModel from './osf-model';
import User from './user';

export const choiceFields = tuple(
    'collectedType',
    'issue',
    'programArea',
    'status',
    'volume',
    'studyDesign',
    'schoolType',
);

export enum CollectionSubmissionReviewStates {
    Accepted = 'accepted',
    InProgress = 'in_progress',
    Pending = 'pending',
    Removed = 'removed',
    Rejected = 'rejected',
}

export type ActionableCollectionSubmissionStates =
    CollectionSubmissionReviewStates.Accepted | CollectionSubmissionReviewStates.Pending;

export const collectionSubmissionStateToDecisionMap = {
    [CollectionSubmissionReviewStates.Accepted]: [CollectionSubmissionActionTrigger.ModeratorRemove],
    [CollectionSubmissionReviewStates.Pending]:
        [CollectionSubmissionActionTrigger.Accept, CollectionSubmissionActionTrigger.Reject],
};

const Validations = buildValidations({
    ...choiceFields.reduce((acc, val) => {
        const disabled = computed('model.displayChoiceFields.[]', function(): boolean {
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
});

export default class CollectionSubmissionModel extends OsfModel.extend(Validations) {
    @attr('string') collectedType?: string;
    @attr('string') issue?: string;
    @attr('string') programArea?: string;
    @attr('string') status?: string;
    @attr('string') volume?: string;
    @attr('string') reviewsState?: CollectionSubmissionReviewStates;
    @attr('string') studyDesign?: string; // custom field for Character Lab
    @attr('string') schoolType?: string; // custom field for Character Lab

    @belongsTo('collection') collection!: Collection;
    @belongsTo('node') guid!: Node;
    @belongsTo('user') creator!: User;
    @hasMany('collection-submission-action')
    collectionSubmissionActions!: AsyncHasMany<CollectionSubmissionAction>;

    @computed('collection.displayChoicesFields.[]')
    get displayChoiceFields() {
        if (this.collection.get('displayChoicesFields')) {
            return choiceFields
                .filter(field => this.collection
                    .get('displayChoicesFields')
                    .includes(`${field}Choices` as ChoicesFields));
        }
        return [];
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'collection-submission': CollectionSubmissionModel;
    } // eslint-disable-line semi
}
