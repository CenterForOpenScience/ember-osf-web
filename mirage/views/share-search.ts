import { Collection, ModelInstance, Request, Schema } from 'ember-cli-mirage';
import config from 'ember-get-config';

import Contributor from 'ember-osf-web/models/contributor';
import RegistrationModel from 'ember-osf-web/models/registration';

import { MirageRegistration } from 'ember-osf-web/mirage/factories/registration';

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

function buildProviderBuckets(registrations: Collection<MirageRegistration>): ProviderBucket[] {
    const providerBuckets = registrations.models.reduce(
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

function getRegistrationsForRequest(schema: Schema, request: Request): Collection<MirageRegistration> {
    const {
        query: {
            bool: {
                filter: filterList,
            },
        },
    } = JSON.parse(request.requestBody);

    // TODO type safety
    const providerFilter = filterList.find((filter: any) => Boolean(filter.terms && filter.terms.sources));
    if (providerFilter) {
        const { terms: { sources: providerShareKeys } } = providerFilter;

        return schema.registrations.where(
            reg => providerShareKeys.includes(reg.provider.shareSourceKey),
        );
    }
    return schema.registrations.all();
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
            `${osfUrl}${contributor.users.id}/`,
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

    const response: SearchResponse = {
        hits: {
            total: registrations.length,
            hits: registrations.models.map(reg => serializeRegistration(reg)),
        },
    };
    if (hasProviderAggregation(request)) {
        response.aggregations = {
            sources: {
                buckets: buildProviderBuckets(registrations),
            },
        };
    }
    return response;
}
