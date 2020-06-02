import { Collection, ModelInstance, Request, Schema } from 'ember-cli-mirage';

import RegistrationModel from 'ember-osf-web/models/registration';

import { MirageRegistration } from 'ember-osf-web/mirage/factories/registration';

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
}

function serializeRegistration(reg: ModelInstance<RegistrationModel>) {
    // TODO serialize all contributors for the given reg
    const serialized = {
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
            identifiers: ['http://osf.io/aurjt/'],
        },
    };
    return serialized;
}

export function shareSearch(schema: Schema, request: Request) {
    // TODO:
    // get provider from request body
    // call buildRegistrationSearchResponse

    const registrations = getRegistrationsForRequest(schema, request);

    return {
        hits: {
            total: registrations.length,
            hits: registrations.models.map(reg => serializeRegistration(reg)),
        },
    };
}

const contributor = {
    affiliations: [],
    awards: [],
    family_name: 'Deutchman',
    given_name: 'Paul',
    types: ['person', 'agent'],
    order_cited: 0,
    relation: 'creator',
    name: 'Paul Michael Deutchman',
    cited_as: 'Paul Michael Deutchman',
    type: 'person',
    identifiers: [
        'http://secure.gravatar.com/avatar/6bffdffd2515a211b5121ab9546a64cf?d=identicon',
        'http://osf.io/6khef/',
    ],
    id: '64229-6B9-B38',
    additional_name: 'Michael',
};
