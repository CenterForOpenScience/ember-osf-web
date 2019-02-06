import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { mapBy } from '@ember-decorators/object/computed';
import Component from '@ember/component';
import { underscore } from '@ember/string';

import CollectedMetadatum, { choiceFields } from 'ember-osf-web/models/collected-metadatum';
import Collection, { ChoicesFields } from 'ember-osf-web/models/collection';
import chunkArray from 'ember-osf-web/utils/chunk-array';

interface CollectionMetadataField {
    labelKey: string;
    valuePath: keyof CollectedMetadatum;
    optionsKey: ChoicesFields;
}

@tagName('')
export default class CollectionMetadata extends Component {
    collection: Collection = this.collection;
    collectedMetadatum: CollectedMetadatum = this.collectedMetadatum;
    didValidate: boolean = this.didValidate;
    initialCollectedMetadatumProperties = this.collectedMetadatum.getProperties(
        'programArea', 'issue', 'status', 'volume', 'collectedType',
    );

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

    @computed(`collectedMetadatum.validations.attrs.{${choiceFields.join()}}.isInvalid`, 'filteredFields')
    get isInvalid(): boolean {
        const { attrs } = this.collectedMetadatum.validations;

        return this.filteredFields.some(field => (attrs[field] as any).isInvalid);
    }

    @action
    discard() {
        this.collectedMetadatum.setProperties(this.initialCollectedMetadatumProperties);
    }
}
