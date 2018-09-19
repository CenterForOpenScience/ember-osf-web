import { classNames } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { dasherize, underscore } from '@ember/string';
import config from 'collections/config/environment';
import { ModelRegistry } from 'ember-data';
import { localClassNames } from 'ember-osf-web/decorators/css-modules';
import CollectedMetadatum, { DisplaySubject } from 'ember-osf-web/models/collected-metadatum';
import Collection from 'ember-osf-web/models/collection';
import Node from 'ember-osf-web/models/node';
import Preprint from 'ember-osf-web/models/preprint';
import Registration from 'ember-osf-web/models/registration';
import Analytics from 'ember-osf-web/services/analytics';
import Theme from 'ember-osf-web/services/theme';
import defaultTo from 'ember-osf-web/utils/default-to';
import { FacetContext } from '../discover-page/component';
import styles from './styles';
import layout from './template';

type Collectable = Collection | Node | Preprint | Registration;
type CollectableType = keyof Pick<ModelRegistry, 'collection' | 'node' | 'preprint' | 'registration'>;

@classNames('p-sm')
@localClassNames('search-result')
export default class SearchResult extends Component {
    layout = layout;
    styles = styles;

    @service analytics!: Analytics;
    @service theme!: Theme;

    hostAppName = config.hostAppName;
    maxTags: number = defaultTo(this.maxTags, 10);
    maxSubjects: number = defaultTo(this.maxSubjects, 10);
    maxCreators: number = defaultTo(this.maxCreators, 10);
    maxDescription: number = defaultTo(this.maxDescription, 300);
    showBody: boolean = defaultTo(this.showBody, false);
    facetContexts: FacetContext[] = this.facetContexts;
    queryParams: string[] | null = defaultTo(this.queryParams, null);
    result: CollectedMetadatum = this.result;

    @alias('result.guid.content') item!: Collectable;
    @alias('item.constructor.modelName') type!: CollectableType;
    @alias('result.displaySubjects')! subjects!: DisplaySubject[];

    @computed('result.displayChoiceFields')
    get choiceFilters() {
        return this.result.displayChoiceFields.map(field => ({
            label: `collections.collection_metadata.${underscore(field)}_label`,
            facet: dasherize(field),
            value: this.result[field],
        }));
    }

    @action
    addFilter(facet: string, item: string): void {
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
