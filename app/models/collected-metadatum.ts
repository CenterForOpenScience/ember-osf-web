import { attr, belongsTo } from '@ember-decorators/data';
import { computed } from '@ember-decorators/object';
import Collection from './collection';
import Guid from './guid';
import OsfModel from './osf-model';
import { SubjectRef } from './taxonomy';
import User from './user';

export default class CollectedMetadatum extends OsfModel {
    @attr('string') collectedType!: string;
    @attr('string') status!: string; // eslint-disable-line no-restricted-globals
    @attr('array') subjects!: SubjectRef[][];

    @belongsTo('collection') collection!: Collection;
    @belongsTo('guid') guid!: Guid;
    @belongsTo('user') creator!: User;

    @computed('subjects')
    get displaySubjects() {
        return this.subjects.map(({ lastObject }) => lastObject);
    }
}

declare module 'ember-data' {
    interface ModelRegistry {
        'collected-metadatum': CollectedMetadatum;
    }
}
