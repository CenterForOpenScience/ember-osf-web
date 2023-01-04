import { classNames } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { dasherize, underscore } from '@ember/string';
import config from 'collections/config/environment';
import { localClassNames } from 'ember-css-modules';
import ModelRegistry from 'ember-data/types/registries/model';

import { layout } from 'ember-osf-web/decorators/component';
import CollectionSubmission from 'ember-osf-web/models/collection-submission';
import Collection from 'ember-osf-web/models/collection';
import Node from 'ember-osf-web/models/node';
import Preprint from 'ember-osf-web/models/preprint';
import Registration from 'ember-osf-web/models/registration';
import Analytics from 'ember-osf-web/services/analytics';
import Theme from 'ember-osf-web/services/theme';

import { FacetContext } from '../discover-page/component';
import styles from './styles';
import template from './template';

type Collectable = Collection | Node | Preprint | Registration;
type CollectableType = keyof Pick<ModelRegistry, 'collection' | 'node' | 'preprint' | 'registration'>;

@layout(template, styles)
@classNames('p-sm')
@localClassNames('search-result')
export default class CollectionSearchResult extends Component {
    @service analytics!: Analytics;
    @service theme!: Theme;

    hostAppName = config.hostAppName;
    maxTags = 10;
    maxCreators = 10;
    maxDescription = 300;
    showBody = false;
    facetContexts!: FacetContext[];
    queryParams: string[] | null = null;
    result!: CollectionSubmission;

    @alias('result.guid.content') item!: Collectable;
    @alias('item.constructor.modelName') type!: CollectableType;

    @computed('result.displayChoiceFields')
    get choiceFilters() {
        return this.result.displayChoiceFields
            .map(field => ({
                label: `collections.collection_metadata.${underscore(field)}_label`,
                facet: dasherize(field),
                value: this.result[field],
            }))
            .filter(({ value }) => !!value);
    }

    @action
    addChoiceFilter(facet: string, item: string) {
        this.facetContexts.findBy('component', facet)!.updateFilters(item);
    }

    @action
    toggleShowBody() {
        this.toggleProperty('showBody');
        this.analytics.track(
            'result',
            !this.showBody ? 'contract' : 'expand',
            `Discover - ${this.item.title}`,
            this.result.id,
        );
    }
}
