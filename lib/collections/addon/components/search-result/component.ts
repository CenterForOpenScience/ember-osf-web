import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { get } from '@ember/object';
import { capitalize } from '@ember/string';
import config from 'collections/config/environment';
import I18N from 'ember-i18n/services/i18n';
import Contributor from 'ember-osf-web/models/contributor';
import Analytics from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';
import moment from 'moment';
import providerRegex from '../../const/providerRegex';
import { FacetContexts } from '../discover-page/component';
import styles from './styles';
import layout from './template';

interface Result {
    id: string;
    title: string;
    type: string;
    description: string;
    identifiers: any[];
    date_updated: any; // eslint-disable-line camelcase
    lists: {
        contributors?: Contributor[];
        retractions?: any[];
    };
    providers: Provider[];
    subjects?: any[];
    subject_synonyms: any[]; // eslint-disable-line camelcase
    tags?: string[];
}

interface Provider {
    name: string; // eslint-disable-line no-restricted-globals
}

interface ThemeProvider {
    id: string;
    additionalProviders: any;
}

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
export default class SearchResult extends Component.extend({
    didRender(...args: any[]) {
        this._super(...args);
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.$()[0]]);
    },
}) {
    layout = layout;
    styles = styles;

    @service analytics!: Analytics;
    @service i18n!: I18N;

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
    result: Result = this.result;

    providerUrlRegex = providerRegex;

    /**
     * Name of detail route for consuming application, if you want search result to link to a route in the consuming spp
     * @property {String} detailRoute
     */
    detailRoute: string = defaultTo(this.detailRoute, '');

    /**
     * Provider loaded from theme service. Passed in from consuming application.
     * @property {Object} themeProvider
     */
    themeProvider: ThemeProvider | null = defaultTo(this.themeProvider, null);

    domainRedirectProviders = [];

    @computed('result.type')
    get type(): string {
        return this.result!.type.replace(/\w\S*/g, capitalize);
    }

    @computed('result.description', 'maxDescription')
    get abbreviated(): boolean {
        return this.result!.description.length > this.maxDescription;
    }

    @computed('result.description')
    get abbreviation(): string {
        return this.result!.description.slice(0, this.maxDescription);
    }

    @computed('result.lists.contributors')
    get allCreators(): any[] {
        return (this.result.lists.contributors || [])
            .filter((contrib: any) => contrib.relation === 'creator')
            .sort((a: any, b: any) => a.order_cited - b.order_cited);
    }

    @computed('allCreators')
    get extraCreators() {
        return this.allCreators.slice(this.maxCreators);
    }

    @computed('allCreators')
    get creators() {
        return this.allCreators.slice(0, this.maxCreators);
    }

    @computed('result.tags')
    get extraTags() {
        return (this.result.tags || []).slice(this.maxTags);
    }

    @computed('result.identifiers')
    get identifiers() {
        return this.result.identifiers;
    }

    @computed('result.tags')
    get tags() {
        return (this.result.tags || []).slice(0, this.maxTags);
    }

    @computed('result.subjects', 'result.subject_synonyms', 'themeProvider')
    get subjects() {
        const subs = (this.themeProvider!.id === 'osf' && this.result.subject_synonyms.length) ?
            this.result.subject_synonyms :
            this.result.subjects;

        const uniqueSubs: any = {};

        subs!.forEach((e: any) => {
            const [tax, ...subjects] = e.text.split('|');

            if (subjects.length) { // accounting for non-custom taxonomy subjects, if we ever get back to that
                for (let i = 0; i < subjects.length; i++) {
                    uniqueSubs[subjects[i]] = {
                        text: subjects[i],
                        value: [tax, ...subjects.slice(0, i + 1)].join('|'),
                        taxonomy: tax,
                    };
                }
            } else {
                uniqueSubs[e.text] = {
                    text: e.text,
                    value: e.text,
                    taxonomy: null,
                };
            }
        });

        return Object.keys(uniqueSubs)
            .map(e => uniqueSubs[e])
            .slice(0, this.maxSubjects);
    }

    @computed('result.subjects')
    get extraSubjects() {
        return (this.result.subjects || []).slice(this.maxSubjects);
    }

    @computed('result.lists.retractions.[]')
    get retractionId() {
        const { retractions } = this.result.lists;

        if (retractions && retractions.length) {
            return retractions[0].id;
        }

        return null;
    }

    @computed('result')
    get osfID(): string | false {
        const re = /osf.io\/(\w+)\/$/;
        // NOTE / TODO : This will have to be removed later. Currently the only "true" preprints are solely from the OSF
        // socarxiv and the like sometimes get picked up by as part of OSF, which is technically true. This will prevent
        // broken links to things that aren't really preprints.
        const osfProvider = this.result.providers.find(({ name }) => name === 'OSF');

        if (this.result.providers.length === 1 && osfProvider) {
            for (const identifier of this.result.identifiers) {
                if (re.test(identifier)) {
                    return re.exec(identifier)![1];
                }
            }
        }

        return false;
    }

    @computed('result')
    get hyperlink() {
        const urlRegex = /^https?:\/\/([^/]+)\/(.+)$/;
        const domainRedirectList = this.domainRedirectProviders;
        const identifiers = this.result.identifiers
            .filter((ident: any) => ident.startsWith('http://') || ident.startsWith('https://'));

        for (const identifier of identifiers) {
            const url = identifier.match(urlRegex);

            if (url) {
                const domainRegex = new RegExp(`^https?://${url[1]}/`);
                for (const domain of domainRedirectList) {
                    if (domainRegex.test(domain)) {
                        // If the domain matches use the path from the identifier concatentated to the domain
                        return `${domain}${url[2]}`;
                    }
                }
            }
        }

        let re = this.providerUrlRegex.OSF;

        for (const { name } of this.result.providers) {
            // If the result has multiple providers and one of them matches use the first one found
            if (name in this.providerUrlRegex) {
                re = this.providerUrlRegex[name];
                break;
            }
        }

        for (const identifier of identifiers) {
            if (re.test(identifier)) {
                return identifier;
            }
        }

        return identifiers[0];
    }

    /**
     * Determines whether tags in search results should be links - preprints and registries are not using tag filter
     * right now.
     * NEW: Preprint providers with additionalProviders are using tags, however.
     */
    @computed('queryParams', 'themeProvider')
    get tagsInQueryParams(): boolean {
        return (this.queryParams || []).includes('tags')
            && (this.themeProvider!.additionalProviders || []).length;
    }

    @computed('result.date_updated')
    get dateUpdated(): string {
        return moment(this.result.date_updated).utc().format('YYYY-MM-DD');
    }

    filterChanged() {
        assert('You should pass in a closure action: filterChanged');
    }

    @action
    addFilter(facet: keyof FacetContexts, item: any): void {
        const context = get(this.facetContexts, facet);

        context.updateFilters(item);

        this.filterChanged();
    }

    @action
    toggleShowBody() {
        this.toggleProperty('showBody');
        this.analytics.track(
            'result',
            !this.showBody ? 'contract' : 'expand',
            `Discover - ${this.result.title}`,
            this.result.id,
        );
    }

    // TODO: fix closure action
    // @action
    // select(item: any) {
    //     this.attrs.select(item);
    // }
}
