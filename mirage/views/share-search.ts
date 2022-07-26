import { ModelInstance, Request, Schema } from 'ember-cli-mirage';
import config from 'ember-get-config';

import Contributor from 'ember-osf-web/models/contributor';
import RegistrationModel from 'ember-osf-web/models/registration';

import { MirageExternalRegistration } from 'ember-osf-web/mirage/models/external-registration';
import { OpenBadges } from 'registries/services/share-search';

const {
    OSF: {
        url: osfUrl,
    },
} = config;

type MixedResult = ModelInstance<RegistrationModel> | ModelInstance<MirageExternalRegistration>;

interface ProviderBucket {
    // eslint-disable-next-line camelcase
    doc_count: number;
    key: string;
}

/* eslint-disable camelcase */
interface SerializedContributor {
    id: string;
    bibliographic: boolean;
    family_name: string;
    given_name: string;
    cited_as: string;
    identifiers: string[];
    name: string;
    order_cited: number;
}


interface SerializedRegistration {
    id: string;
    description: string;
    contributors: string[];
    date_created?: string;
    date_modified?: string;
    date_published?: string;
    date_registered?: string;
    date_updated?: string;
    identifiers: string[];
    justification?: string;
    lists: {
        contributors: SerializedContributor[],
    };
    registration_type: string;
    retracted?: boolean;
    sources?: string[];
    subject_synonyms: string[];
    subjects: string[];
    tags: string[];
    title: string;
    type: string;
    withdrawn: boolean;
    open_badges?: OpenBadges;
}

interface SearchHit {
    _id: string;
    _source: SerializedRegistration;
}
/* eslint-enable camelcase */

interface SearchResponse {
    hits: {
        total: number,
        hits: SearchHit[],
    };
    aggregations?: unknown;
}

function hasProviderAggregation(request: Request): boolean {
    const requestBody = JSON.parse(request.requestBody);
    return Boolean(
        requestBody
        && requestBody.aggregations
        && requestBody.aggregations.sources
        && requestBody.aggregations.sources.terms
        && requestBody.aggregations.sources.terms.field === 'sources',
    );
}

function buildProviderBuckets(registrations: MixedResult[]): ProviderBucket[] {
    const providerBuckets = registrations.reduce(
        (counts, reg) => {
            const count = counts[reg.provider.shareSource!] || 0;
            // eslint-disable-next-line no-param-reassign
            counts[reg.provider.shareSource!] = count + 1;
            return counts;
        },
        {} as Record<string, number | undefined>,
    );
    return Object.entries(providerBuckets)
        .sortBy('count')
        .map(([key, count]) => ({ key, doc_count: count! }));
}

function serializeExternalRegistration(
    externalReg: MirageExternalRegistration,
): SerializedRegistration {
    return {
        date_registered: externalReg.dateRegistered,
        date_published: externalReg.dateRegistered,
        sources: [externalReg.provider.shareSource],
        registration_type: 'yes this is a schema',
        type: 'registration',
        subject_synonyms: [],
        id: externalReg.id,
        lists: {
            contributors: [
                {
                    family_name: 'Famfam',
                    given_name: 'Givgiv',
                    bibliographic: true,
                    order_cited: 0,
                    name: 'Givgiv Addadd Famfam',
                    cited_as: 'G.A. Famfam',
                    identifiers: [
                        'https://elsewhere.example.com/givgiv',
                    ],
                    id: 'haha',
                },
            ],
        },
        subjects: [],
        title: externalReg.title,
        contributors: ['G.A. Famfam'],
        date_updated: externalReg.dateModified,
        description: externalReg.description,
        date_modified: externalReg.dateModified,
        date_created: externalReg.dateRegistered,
        tags: ['project'],
        identifiers: ['https://elsewhere.example.com/registration'],
        withdrawn: false,
    };
}

function serializeContributor(contributor: ModelInstance<Contributor>): SerializedContributor {
    return {
        family_name: contributor.users.familyName,
        given_name: contributor.users.givenName,
        name: contributor.users.fullName,
        order_cited: contributor.index,
        bibliographic: true,
        cited_as: contributor.fullName,
        identifiers: [
            `https://osf.io/${contributor.users.id}/`,
        ],
        id: contributor.id,
    };
}

function serializeRegistration(reg: ModelInstance<RegistrationModel>): SerializedRegistration {
    return {
        date_registered: reg.dateRegistered.toString(),
        date_published: reg.dateRegistered.toString(),
        justification: reg.withdrawalJustification,
        sources: [reg.provider.shareSource!],
        registration_type: reg.registrationSchema.name,
        type: 'registration',
        subject_synonyms: [],
        id: reg.id,
        lists: {
            contributors: reg.contributors.models.map(contributor => serializeContributor(contributor)),
        },
        subjects: [],
        title: reg.title,
        retracted: reg.withdrawn,
        contributors: reg.contributors.models.map(contributor => contributor.fullName),
        date_updated: reg.dateModified.toString(),
        description: reg.description,
        date_modified: reg.dateModified.toString(),
        date_created: reg.dateRegistered.toString(),
        tags: ['project'],
        withdrawn: reg.withdrawn,
        identifiers: [`${osfUrl}${reg.id}/`],
        open_badges: {
            data: reg.hasData,
            materials: reg.hasMaterials,
            analytic_code: reg.hasAnalyticCode,
        },
    };
}

function isExternal(reg: MixedResult): reg is ModelInstance<MirageExternalRegistration> {
    return Boolean('isExternal' in reg && reg.isExternal);
}

function serializeMixedResult(reg: MixedResult): SearchHit {
    const serialized = isExternal(reg)
        ? serializeExternalRegistration(reg)
        : serializeRegistration(reg);
    return {
        _id: reg.id,
        _source: serialized,
    };
}

function getResultsForProviders(schema: Schema, providerShareKeys: string[]): MixedResult[] {
    const results: MixedResult[] = [];
    for (const providerShareKey of providerShareKeys) {
        const provider = schema.registrationProviders.findBy({ shareSource: providerShareKey });
        if (provider) {
            results.push(...provider.registrations.models);
        } else {
            const externalProvider = schema.externalProviders.findBy({ shareSource: providerShareKey });
            if (externalProvider) {
                results.push(...externalProvider.registrations.models);
            }
        }
    }
    return results;
}

export function shareSearch(schema: Schema, request: Request) {
    const requestBody = JSON.parse(request.requestBody);
    const filterList = requestBody.query.bool.filter;
    const queryString = requestBody.query.bool.must.query_string.query;
    const providerFilter = filterList.find((filter: any) => Boolean(filter.terms && filter.terms.sources));

    let allResults: MixedResult[];
    if (providerFilter) {
        // get registrations (and external-registrations) for the given providers
        const { terms: { sources: providerShareKeys } } = providerFilter;
        allResults = getResultsForProviders(schema, providerShareKeys);
    } else {
        // get all registrations (and external-registrations)
        allResults = [
            ...schema.registrations.all().models,
            ...schema.externalRegistrations.all().models,
        ];
    }
    if (queryString !== '*') {
        allResults = allResults.filter(item => item.title.includes(queryString));
    }

    // paginate
    const fromIndex = requestBody.from;
    const pageSize = requestBody.size;
    const resultPage = allResults.slice(fromIndex, fromIndex + pageSize);

    const response: SearchResponse = {
        hits: {
            total: allResults.length,
            hits: resultPage.map(reg => serializeMixedResult(reg)),
        },
    };

    if (hasProviderAggregation(request)) {
        response.aggregations = {
            sources: {
                buckets: buildProviderBuckets(allResults),
            },
        };
    }
    return response;
}
