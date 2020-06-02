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

function serializeRegistration(reg: ModelInstance<RegistrationModel>) {
    // TODO serialize all contributors for the given reg
    const serialized = {
        _source: {
            date: reg.dateRegistered,
            date_published: reg.dateRegistered,
            justification:   null,
            sources: [reg.provider.shareSourceKey],
            affiliations: [],
            registration_type: reg.schema.name,
            type: 'registration',
            subject_synonyms: [],
            id: reg.id,
            language:   null,
            types: ['registration', 'publication', 'creative work'],
            lists: {
                contributors: [],
            },
            subjects: [],
            title:   "2016, Deutchman, The Role of Framing Effects, the Dark Triad, and Empathy in Predicting Behavior in a One-shot Prisoner's Dilemma",
            retracted:   false,
            contributors: ['Jess Sullivan', 'Paul Michael Deutchman'],
            date_updated:   '2017-07-30T17:34:31.234631+00:00',
            description:   'This project is designed to support Haverford College economics majors who produce empirical theses. The structure is based on the TIER Documentation Protocol. Additional information about Project TIER is available at http://projecttier.org',
            date_modified:   '2017-07-31T02:26:51.566149+00:00',
            date_created:   '2016-12-07T18:00:39.914615+00:00',
            tags: ['project'],
            withdrawn:   false,
            identifiers: ['http://osf.io/aurjt/'], , ,
        },
    };
    return serialized;
}

function serializeContributor(contributor: ModelInstance<Contributor>) {
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
    identifiers: ['http://secure.gravatar.com/avatar/6bffdffd2515a211b5121ab9546a64cf?d=identicon', 'http://osf.io/6khef/'],
    id: '64229-6B9-B38',
    additional_name: 'Michael',
};
