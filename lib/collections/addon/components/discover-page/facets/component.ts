import Component from '@ember/component';
import { assert } from '@ember/debug';
import { FacetContexts } from '../component';
import styles from './styles';
import layout from './template';

/**
 * Copied from Ember-SHARE. Passing in a few properties from preprints.
 * Loops through all the facets and displays them on the left hand pane of the Discover page.
 *
 * ```handlebars
 * {{faceted-search
 *      onChange='filtersChanged'
 *      updateParams='updateParams'
 *      filters=facetFilters
 *      facetStates=facetStates
 *      facets=facets
 *      aggregations=aggregations
 *      activeFilters=activeFilters
 *      updateFilters=(action 'updateFilters')
 *      filterReplace=filterReplace
 * }}
 * ```
 * @class faceted-search
 */
export default class FacetedSearch extends Component {
    layout = layout;
    styles = styles;

    facetContexts: FacetContexts = this.facetContexts;

    filterChanged() {
        assert('You should pass in a closure action: filterChanged');
    }
}
