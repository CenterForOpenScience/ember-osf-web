import unescapeXMLEntities from 'ember-osf-web/utils/fix-special-char';
import { Map } from 'immutable';
import config from 'registries/config/environment';
import Search, {
    SearchFilter,
    SearchModifier,
    SearchOptions,
    SearchResults,
    TypedMap,
} from 'registries/services/search';

abstract class ShareFilter extends SearchFilter {
    protected ensureFilterKey(query: any): any {
        const q = query;
        q.query = query.query || {};
        q.query.bool = query.query.bool || {};
        q.query.bool.filter = query.query.bool.filter || [];
        return q.query.bool.filter;
    }
}

export class ShareTermsFilter extends ShareFilter {
    static type = Symbol('terms-or');

    constructor(key: string, value: string, display: string) {
        super({
            type: ShareTermsFilter.type,
            display,
            key,
            value,
        });
    }

    apply(query: any): any {
        let filter = this.ensureFilterKey(query).find(
            (el: any) => Object.keys(el.terms || {})[0] === this.internal.get('key'),
        );

        if (!filter) {
            filter = { terms: { [this.key]: [] } };
            query.query.bool.filter.push(filter);
        }

        filter.terms[this.key].push(this.value);

        return query;
    }
}

export class ShareTermsAggregation implements SearchModifier {
    private readonly valueImpl: TypedMap<ShareTermsAggregation>;

    constructor(private name: string, private field: string, private size: number = 200) {
        this.valueImpl = Map(Object.entries(this)) as TypedMap<ShareTermsAggregation>;
    }

    apply(query: any): any {
        const q = query;
        q.aggregations = q.aggregations || {};
        q.aggregations[this.name] = {
            terms: {
                field: this.field,
                size: this.size,
            },
        };
        return q;
    }

    equals(other: any): boolean {
        return this.valueImpl.equals(other);
    }

    hashCode() {
        return this.valueImpl.hashCode();
    }
}

export interface ShareContributor {
    id: string;
    bibliographic: boolean;
    citedAs: string;
    identifiers: string[];
    name: string;
    orderCited: number;
}

export interface ShareRegistration {
    id: string;
    description: string;
    contributors: ShareContributor[];
    dateCreated?: Date;
    dateModified?: Date;
    datePublished?: Date;
    dateUpdated?: Date;
    mainLink: string;
    hyperLinks: string[];
    infoLinks: Array<{ type: string; uri: string; }>;
    registrationType: string;
    sources: string[];
    subjectSynonyms: string[];
    subjects: string[];
    tags: string[];
    title: string;
    withdrawn: boolean;
}

export default class ShareSearch extends Search {
    static registrationsFilter = new ShareTermsFilter('types', 'registration', 'Registration');

    url(): string {
        return `${config.shareSearchBaseURL}/creativeworks/_search`;
    }

    extractTotal(response: any): number {
        return response.hits.total as number;
    }

    extractAggregations(response: any): {[key: string]: any} {
        return response.aggregations;
    }

    async registrations(options: SearchOptions): Promise<SearchResults<ShareRegistration>> {
        return this.search(
            options.addFilters(ShareSearch.registrationsFilter),
            this._postProcessRegistrations,
        );
    }

    // The output of this method must be a valid ES query
    // See here for details:
    // https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-body.html
    buildQuery(options: SearchOptions): any {
        let query: any = {
            size: options.size,
            from: (options.page - 1) * options.size,
            query: {
                bool: {
                    must: {
                        query_string: { query: options.query || '*' },
                    },
                },
            },
        };

        for (const filter of options.filters) {
            query = filter.apply(query);
        }

        for (const modifier of options.modifiers) {
            query = modifier.apply(query);
        }

        if (options.order.key) {
            query.sort = {
                [options.order.key]: options.order.ascending ? 'asc' : 'desc',
            };
        }

        return query;
    }

    // `registrations` here is a standard ES response from SHARE. See the ES API for the structure
    // https://www.elastic.co/guide/en/elasticsearch/reference/current/_the_search_api.html
    _postProcessRegistrations(registrations: any): ShareRegistration[] {
        return registrations.hits.hits.map((r: any): ShareRegistration => {
            const contributors = (r._source.lists.contributors || [])
                .map((contrib: any): ShareContributor => ({
                    id: contrib.id as string,
                    bibliographic: contrib.relation !== 'contributor',
                    citedAs: unescapeXMLEntities(contrib.cited_as),
                    identifiers: contrib.identifiers as string[],
                    name: unescapeXMLEntities(contrib.name),
                    orderCited: contrib.order_cited || -1,
                } as ShareContributor))
                .sort((a: ShareContributor, b: ShareContributor) => a.orderCited - b.orderCited);

            let mainLink: string | undefined;
            const infoLinks: Array<{ type: string; uri: string; }> = [];
            const hyperLinks: string[] = [
                `${config.shareBaseURL}/${r._source.type.replace(/ /g, '')}/${r._id}`,
            ];

            for (const identifier of (r._source.identifiers as string[])) {
                if (/^https?:\/\//.test(identifier)) {
                    hyperLinks.push(identifier);

                    // Test to see if this link is the "main" link
                    for (const source of config.sourcesWhitelist) {
                        if (!new RegExp(source.urlRegex).test(identifier)) {
                            continue;
                        }

                        mainLink = source.https ? identifier.replace('http://', 'https://') : identifier;
                    }
                } else {
                    const [type, uri] = identifier.split('://');
                    infoLinks.push({ type, uri });
                }
            }

            return {
                contributors,
                hyperLinks,
                infoLinks,
                id: r._id,
                sources: r._source.sources.map(
                    (source: string) => {
                        const entry = config.sourcesWhitelist.find(x => x.name === source);
                        return (entry && entry.display) ? entry.display : source;
                    },
                ),
                mainLink: mainLink || hyperLinks[0],
                registrationType: r._source.registration_type,
                title: unescapeXMLEntities(r._source.title),
                subjects: r._source.subjects,
                subjectSynonyms: r._source.subject_synonyms,
                description: unescapeXMLEntities(r._source.description),
                dateUpdated: r._source.date_updated ? new Date(r._source.date_updated) : undefined,
                dateCreated: r._source.date_created ? new Date(r._source.date_created) : undefined,
                dateModified: r._source.date_modified ? new Date(r._source.date_modified) : undefined,
                datePublished: r._source.date_published ? new Date(r._source.date_published) : undefined,
                tags: r._source.tags.map(unescapeXMLEntities),
                withdrawn: r._source.withdrawn,
            };
        });
    }
}
