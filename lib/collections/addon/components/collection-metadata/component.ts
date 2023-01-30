import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { mapBy } from '@ember/object/computed';
import { underscore } from '@ember/string';

import CollectionSubmission, { choiceFields } from 'ember-osf-web/models/collection-submission';
import Collection, { ChoicesFields } from 'ember-osf-web/models/collection';
import chunkArray from 'ember-osf-web/utils/chunk-array';

interface CollectionMetadataField {
    labelKey: string;
    valuePath: keyof CollectionSubmission;
    optionsKey: ChoicesFields;
}

export default class CollectionMetadata extends Component {
    collection!: Collection;
    collectionSubmission!: CollectionSubmission;
    didValidate!: boolean;

    initialCollectionSubmissionProperties: any;

    @computed('collection')
    get displayFields(): CollectionMetadataField[] {
        return choiceFields
            .map(valuePath => ({
                labelKey: `${underscore(valuePath)}_label`,
                optionsKey: `${valuePath}Choices`,
                valuePath,
            } as CollectionMetadataField))
            .filter(({ optionsKey }) => {
                const choices = this.collection[optionsKey];

                return choices && !!choices.length;
            });
    }

    @computed('displayFields.[]')
    get chunkedDisplayFields(): CollectionMetadataField[][] {
        return chunkArray(this.displayFields, 2);
    }

    @mapBy('displayFields', 'valuePath')
    filteredFields!: Array<keyof CollectionSubmission>;

    @computed(`collectionSubmission.validations.attrs.{${choiceFields.join()}}.isInvalid`,
        'collectionSubmission.validations', 'filteredFields')
    get isInvalid(): boolean {
        const { attrs } = this.collectionSubmission.validations;

        return this.filteredFields.some(field => (attrs[field] as any).isInvalid);
    }

    init() {
        super.init();
        this.set(
            'initialCollectionSubmissionProperties',
            this.collectionSubmission.getProperties(
                'programArea', 'issue', 'status', 'volume', 'collectedType',
            ),
        );
    }

    @action
    discard() {
        this.collectionSubmission.setProperties(this.initialCollectionSubmissionProperties);
    }
}
