import { classNames } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { get } from '@ember/object';
import config from 'collections/config/environment';
import { ModelRegistry } from 'ember-data';
import I18N from 'ember-i18n/services/i18n';
import { localClassNames } from 'ember-osf-web/decorators/css-modules';
import CollectedMetadatum from 'ember-osf-web/models/collected-metadatum';
import Collection from 'ember-osf-web/models/collection';
import Node from 'ember-osf-web/models/node';
import Preprint from 'ember-osf-web/models/preprint';
import Registration from 'ember-osf-web/models/registration';
import { SubjectRef } from 'ember-osf-web/models/taxonomy';
import Analytics from 'ember-osf-web/services/analytics';
import Theme from 'ember-osf-web/services/theme';
import defaultTo from 'ember-osf-web/utils/default-to';
import { FacetContexts } from '../discover-page/component';
import styles from './styles';
import layout from './template';

type Collectable = Collection | Node | Preprint | Registration;
type CollectableType = keyof Pick<ModelRegistry, 'collection' | 'node' | 'preprint' | 'registration'>;

/**
 * Adapted from Ember-SHARE and Ember Preprints
 * Used for search results on discover page.
 *
 * ```handlebars
 * {{search-result
 *      detailRoute=detailRoute
 *      addFilter='addFilter'
 *      result=result
 *      queryParams=queryParams
 *      filterReplace=filterReplace
 *      updateFilters=(action 'updateFilters')
 * }}
 * ```
 * @class search-result
 */

@classNames('p-sm')
@localClassNames('search-result')
export default class SearchResult extends Component {
    layout = layout;
    styles = styles;

    @service analytics!: Analytics;
    @service i18n!: I18N;
    @service theme!: Theme;

    hostAppName = config.hostAppName;
    maxTags: number = defaultTo(this.maxTags, 10);
    maxSubjects: number = defaultTo(this.maxSubjects, 10);
    maxCreators: number = defaultTo(this.maxCreators, 10);
    maxDescription: number = defaultTo(this.maxDescription, 300);
    showBody: boolean = defaultTo(this.showBody, false);
    facetContexts: FacetContexts = this.facetContexts;

    /**
     * Array of query params being used in consuming app
     * @property {Array} queryParams
     */
    queryParams: string[] | null = defaultTo(this.queryParams, null);

    /**
     * Search result from SHARE
     * @property {Object} result
     */
    result: CollectedMetadatum = this.result;

    @alias('result.guid.content') item!: Collectable;
    @alias('item.constructor.modelName') type!: CollectableType;
    @alias('result.displaySubjects') subjects!: SubjectRef;

    @action
    addFilter(facet: keyof FacetContexts, item: string): void {
        const context = get(this.facetContexts, facet);

        context.updateFilters(item);
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
