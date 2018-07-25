import { tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import Component from '@ember/component';
import CollectedMetadatum from 'ember-osf-web/models/collected-metadatum';
import Collection from 'ember-osf-web/models/collection';

interface CollectionMetadataField {
    labelKey: string;
    valuePath: keyof CollectedMetadatum;
    optionsKey: keyof Collection;
}

@tagName('')
export default class CollectionMetadata extends Component {
    collection: Collection = this.collection;
    collectedMetadatum: CollectedMetadatum = this.collectedMetadatum;
    didValidate: boolean = this.didValidate;

    fields: CollectionMetadataField[] = [
        {
            labelKey: 'collection_metadata_type_label',
            valuePath: 'collectedType',
            optionsKey: 'collectedTypeChoices',
        },
        {
            labelKey: 'collection_metadata_status_label',
            valuePath: 'status',
            optionsKey: 'statusChoices',
        },
    ];

    @action
    discard() {
        this.collectedMetadatum.setProperties({
            collectedType: '',
            status: '',
        });
    }
}
