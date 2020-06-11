import { ModelInstance, Request, Schema } from 'ember-cli-mirage';
import config from 'ember-get-config';

import Contributor from 'ember-osf-web/models/contributor';
import RegistrationModel from 'ember-osf-web/models/registration';

import RegistrationFactory, { MirageRegistration } from 'ember-osf-web/mirage/factories/registration';

const {
    OSF: {
        url: osfUrl,
    },
} = config;

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

interface ProviderBucket {
    // eslint-disable-next-line camelcase
    doc_count: number;
    key: string;
}

function getExternalProviders(): ProviderBucket[] {
    return [
        { doc_count: 10000, key: 'ClinicalTrials.gov' },
        { doc_count: 3200000, key: 'Research Registry' },
    ];
}

function buildProviderBuckets(registrations: Array<ModelInstance<MirageRegistration>>): ProviderBucket[] {
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

function getRegistrationsForRequest(schema: Schema, request: Request): Array<ModelInstance<MirageRegistration>> {
    const requestBody = JSON.parse(request.requestBody);
    const filterList = requestBody.query.bool.filter;
    const providerFilter = filterList.find((filter: any) => Boolean(filter.terms && filter.terms.sources));
    if (providerFilter) {
        const { terms: { sources: providerShareKeys } } = providerFilter;

        return schema.registrations.all().models.filter(
            reg => reg.provider && providerShareKeys.includes(reg.provider.shareSourceKey),
        );
    }
    return schema.registrations.all().models;
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

function buildExternalRegistrations(shareSourceKey: string) {
    // TODO type safety
    const externalRegistrations = Array.from({ length: 3 }).map(
        // @ts-ignore
        () => new RegistrationFactory().build(100),
    ).map(
        externalReg => serializeExternalRegistration(externalReg, shareSourceKey),
    );

    return externalRegistrations;
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

export function shareSearch(schema: Schema, request: Request) {
    const registrations = getRegistrationsForRequest(schema, request);

    const externalProviders = server.schema.externalProviders().all();

    const externalRegistrations = externalProviders
        .map(({ key }) => buildExternalRegistrations(key))
        .reduce((a1, a2) => [...a1, ...a2]);

    const response: SearchResponse = {
        hits: {
            total: registrations.length,
            hits: [
                ...registrations.map(reg => serializeRegistration(reg)),
                ...externalRegistrations,
            ],
        },
    };
    if (hasProviderAggregation(request)) {
        response.aggregations = {
            sources: {
                buckets: [...buildProviderBuckets(registrations), ...externalProviders],
            },
        };
    }
    return response;
}
