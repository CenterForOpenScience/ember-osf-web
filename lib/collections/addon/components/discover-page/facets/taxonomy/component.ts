import { service } from '@ember-decorators/service';
import { setProperties } from '@ember/object';
import Provider from 'ember-osf-web/models/provider';
import Taxonomy from 'ember-osf-web/models/taxonomy';
import Theme from 'ember-osf-web/services/theme';
import Base from '../base/component';
import styles from './styles';
import layout from './template';

const pageSize = 150;

export interface TaxonomyItem {
    id: string;
    text: string;
    children: TaxonomyItem[];
    childCount: number;
    shareTitle: string;
    path: string;
}

/**
 * @module ember-preprints
 * @submodule components
 */

/**
 * Builds taxonomy facet for discover page - to be used with Ember-OSF's discover-page component.
 *
 * Sample usage:
 * ```handlebars
 * {{search-facet-taxonomy
 *      updateFilters=(action 'updateFilters')
 *      activeFilters=activeFilters
 *      options=facet
 *      filterReplace=filterReplace
 *      key=key
 * }}
 * ```
 * @class search-facet-taxonomy
 */
export default class SearchFacetTaxonomy extends Base.extend({
    didReceiveAttrs(this: SearchFacetTaxonomy, ...args: any[]) {
        this._super(...args);

        const { context, filterChanged } = this;

        setProperties(context, {
            didInit: true,
            updateFilters(item?: string) {
                const { activeFilter, defaultQueryFilters } = context;

                if (item) {
                    const method = activeFilter.includes(item) ? 'removeObject' : 'pushObject';
                    activeFilter[method](item);
                }

                setProperties(context, {
                    queryParam: activeFilter.join('OR'),
                    currentQueryFilters: !activeFilter.length ?
                        defaultQueryFilters :
                        {
                            subjects: activeFilter.map(path => path.replace(/^.*\|/, '')),
                        },
                });

                filterChanged();
            },
        });

        context.updateFilters();

        setProperties(this, {
            item: {
                id: 'null',
                text: '',
                children: [],
                childCount: 0,
                shareTitle: '',
                path: '',
            },
        });

        SearchFacetTaxonomy.getTaxonomies(this.item, this.theme.provider!);
    },
}) {
    static async getTaxonomies(item: TaxonomyItem, provider: Provider) {
        const results: Taxonomy[] = await provider.queryHasMany('taxonomies', {
            filter: { parents: item.id },
            page: { size: pageSize },
        });

        setProperties(item, {
            children: results
                .map(({ id, text, childCount, shareTitle, path }) => ({
                    id,
                    text,
                    children: [],
                    childCount,
                    shareTitle,
                    path,
                }))
                .sortBy('text'),
        });
    }

    @service theme!: Theme;

    layout = layout;
    styles = styles;

    item: TaxonomyItem = this.item;
    expandedList: string[] = [];
}
