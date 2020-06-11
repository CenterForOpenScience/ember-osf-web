import { ModelInstance, Request, Schema } from 'ember-cli-mirage';
import config from 'ember-get-config';

import Contributor from 'ember-osf-web/models/contributor';
import RegistrationModel from 'ember-osf-web/models/registration';

import RegistrationFactory, { MirageRegistration } from 'ember-osf-web/mirage/factories/registration';
import { MirageExternalProvider } from 'ember-osf-web/mirage/models/external-provider';
import { MirageExternalRegistration } from 'ember-osf-web/mirage/models/external-registration';

const {
    OSF: {
        url: osfUrl,
    },
} = config;

type MixedResult = ModelInstance<MirageRegistration> | ModelInstance<MirageExternalRegistration>;

interface ProviderBucket {
    // eslint-disable-next-line camelcase
    doc_count: number;
    key: string;
}

function hasProviderAggregation(request: Request): boolean {
    const requestBody = JSON.parse(request.requestBody);
    return Boolean(
        requestBody &&
        requestBody.aggregations &&
        requestBody.aggregations.sources &&
        requestBody.aggregations.sources.terms &&
        requestBody.aggregations.sources.terms.field === 'sources',
    );
}

function buildProviderBuckets(registrations: MixedResult[]): ProviderBucket[] {
    const providerBuckets = registrations.reduce(
        (counts, reg) => {
            const count = counts[reg.provider.shareSourceKey!] || 0;
            // eslint-disable-next-line no-param-reassign
            counts[reg.provider.shareSourceKey!] = count + 1;
            return counts;
        },
        {} as Record<string, number | undefined>,
    );
    return Object.entries(providerBuckets)
        .sortBy('count')
        .map(([key, count]) => ({ key, doc_count: count! }));
}

function serializeExternalRegistration(externalReg: any, shareSourceKey: string) {
    const serialized = {
        _id: 'fake-share-id',
        _source: {
            date: externalReg.dateRegistered,
            date_published: externalReg.dateRegistered,
            justification: externalReg.withdrawalJustification,
            sources: [shareSourceKey],
            affiliations: [],
            registration_type: 'yes this is a schema',
            type: 'registration',
            subject_synonyms: [],
            id: externalReg.id,
            language: null,
            types: ['registration', 'publication', 'creative work'],
            lists: {
                contributors: [
                    {
                        affiliations: [],
                        awards: [],
                        family_name: 'Famfam',
                        given_name: 'Givgiv',
                        types: ['person', 'agent'],
                        order_cited: 0,
                        relation: 'creator',
                        name: 'Givgiv Addadd Famfam',
                        cited_as: 'G.A. Famfam',
                        type: 'person',
                        identifiers: [
                            'https://elsewhere.example.com/givgiv',
                        ],
                        id: 'haha',
                        additional_name: 'Addadd',
                    },
                ],
            },
            subjects: [],
            title: externalReg.title,
            retracted: externalReg.withdrawn,
            contributors: ['G.A. Famfam'],
            date_updated: externalReg.dateModified,
            description: externalReg.description,
            date_modified: externalReg.dateModified,
            date_created: externalReg.dateRegistered,
            tags: ['project'],
            withdrawn: externalReg.withdrawn,
            identifiers: ['https://elsewhere.example.com/registration'],
        },
    };
    return serialized;
}

function serializeContributor(contributor: ModelInstance<Contributor>) {
    return {
        affiliations: [],
        awards: [],
        family_name: contributor.users.familyName,
        given_name: contributor.users.givenName,
        types: ['person', 'agent'],
        order_cited: contributor.index,
        relation: 'creator',
        name: contributor.users.fullName,
        cited_as: contributor.fullName,
        type: 'person',
        identifiers: [
            `https://osf.io/${contributor.users.id}/`,
        ],
        id: contributor.id,
        additional_name: contributor.users.middleNames,
    };
}

function serializeRegistration(reg: ModelInstance<RegistrationModel>) {
    const serialized = {
        _id: 'fake-share-id',
        _source: {
            date: reg.dateRegistered,
            date_published: reg.dateRegistered,
            justification: reg.withdrawalJustification,
            sources: [reg.provider.shareSourceKey],
            affiliations: [],
            registration_type: reg.registrationSchema.name,
            type: 'registration',
            subject_synonyms: [],
            id: reg.id,
            language: null,
            types: ['registration', 'publication', 'creative work'],
            lists: {
                contributors: reg.contributors.models.map(contributor => serializeContributor(contributor)),
            },
            subjects: [],
            title: reg.title,
            retracted: reg.withdrawn,
            contributors: reg.contributors.models.map(contributor => contributor.fullName),
            date_updated: reg.dateModified,
            description: reg.description,
            date_modified: reg.dateModified,
            date_created: reg.dateRegistered,
            tags: ['project'],
            withdrawn: reg.withdrawn,
            identifiers: [`${osfUrl}${reg.id}/`],
        },
    };
    return serialized;
}

interface SearchResponse {
    hits: {
        total: number,
        hits: unknown[],
    };
    aggregations?: any;
}

function getResultsForProviders(schema: Schema, providerShareKeys: string[]): MixedResult[] {
    const results = [];
    for (const providerShareKey of providerShareKeys) {
        const provider = schema.registrationProviders.findBy({ shareSourceKey: providerShareKey });
        if (provider) {
            results.push(...provider.registrations.models);
        } else {
            const externalProvider = schema.externalProviders.findBy({ shareSourceKey: providerShareKey });
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

    // paginate
    const fromIndex: number = requestBody.from;
    const pageSize: number = requestBody.size;
    const resultPage = allResults.slice(fromIndex, fromIndex + pageSize);

    const response: SearchResponse = {
        hits: {
            total: allResults.length,
            hits: resultPage.map(reg => serializeRegistration(reg)),
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
