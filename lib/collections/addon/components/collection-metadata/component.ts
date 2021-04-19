import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { mapBy } from '@ember/object/computed';
import { underscore } from '@ember/string';

import CollectedMetadatum, { choiceFields } from 'ember-osf-web/models/collected-metadatum';
import Collection, { ChoicesFields } from 'ember-osf-web/models/collection';
import chunkArray from 'ember-osf-web/utils/chunk-array';

interface CollectionMetadataField {
    labelKey: string;
    valuePath: keyof CollectedMetadatum;
    optionsKey: ChoicesFields;
}

export default class CollectionMetadata extends Component {
    collection!: Collection;
    collectedMetadatum!: CollectedMetadatum;
    didValidate!: boolean;

    initialCollectedMetadatumProperties: any;

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
    filteredFields!: Array<keyof CollectedMetadatum>;

    @computed(`collectedMetadatum.validations.attrs.{${choiceFields.join()}}.isInvalid`, 'collectedMetadatum.validations', 'filteredFields')
    get isInvalid(): boolean {
        const { attrs } = this.collectedMetadatum.validations;

        return this.filteredFields.some(field => (attrs[field] as any).isInvalid);
    }

    init() {
        super.init();
        this.set(
            'initialCollectedMetadatumProperties',
            this.collectedMetadatum.getProperties(
                'programArea', 'issue', 'status', 'volume', 'collectedType',
            ),
        );
    }

    @action
    discard() {
        this.collectedMetadatum.setProperties(this.initialCollectedMetadatumProperties);
    }
}
