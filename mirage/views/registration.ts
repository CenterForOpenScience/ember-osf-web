import { HandlerContext, ModelInstance, Request, Response, Schema } from 'ember-cli-mirage';
import faker from 'faker';

import RegistrationModel from 'ember-osf-web/models/registration';

import { guid } from '../factories/utils';
import { process } from './utils';

export function forkRegistration(this: HandlerContext, schema: Schema) {
    const attrs = this.normalizedRequestAttrs('registration');
    const forkedFrom = schema.registrations.find(attrs.id);
    const registrationSchema = schema.registrationSchemas.find('prereg_challenge');
    const newFork = schema.registrations.create({
        forkedDate: new Date(),
        fork: true,
        forkedFrom,
        registrationSchema,
        title: `fork of ${forkedFrom.title}`,
    });
    return newFork;
}

export function registrationDetail(this: HandlerContext, schema: Schema, request: Request) {
    const { id } = request.params;
    const registration = schema.registrations.find(id);

    if (registration.embargoed && !registration.currentUserPermissions.length) {
        return new Response(404, {}, {
            meta: { version: '2.9' },
            errors: [{ detail: 'Not found.' }],
        });
    }

    const { data } = process(schema, request, this, [this.serialize(registration).data]);

    return { data: data[0] };
}

export function createRegistration(this: HandlerContext, schema: Schema) {
    const attrs = this.normalizedRequestAttrs('registration');
    const randomNum = faker.random.number();
    const registrationGuid = guid('registration');
    const id = registrationGuid(randomNum);
    const draft = schema.draftRegistrations.find(attrs.draftRegistrationId);

    schema.guids.create({ id, referentType: 'registration' });

    const newReg = schema.registrations.create({
        id,
        embargoed: Boolean(attrs.embargoEndDate),
        dateRegistered: new Date(),
        registeredFrom: draft.branchedFrom,
        registrationSchema: draft.registrationSchema,
        tags: draft.branchedFrom.tags || [],
        category: draft.branchedFrom.category,
        contributors: draft.branchedFrom.contributors.models,
        currentUserPermissions: draft.branchedFrom.currentUserPermissions,
        ...attrs,
    });

    return newReg;
}

export function getProviderRegistrations(this: HandlerContext, schema: Schema, request: Request) {
    const { parentID: providerId } = request.params;
    const { 'filter[reviews_state]': params, pageSize } = request.queryParams;
    const filterParams = params.split(',');

    const provider = schema.registrationProviders.find(providerId);
    const providerRegistrations = provider.registrations.models;
    let filteredRegistrations: Array<ModelInstance<RegistrationModel>> = [];

    for (const param of filterParams) {
        filteredRegistrations = filteredRegistrations.concat(
            providerRegistrations.filter(
                (registration: ModelInstance<RegistrationModel>) => registration.reviewsState === param,
            ),
        );
    }

    return process(
        schema,
        request,
        this,
        filteredRegistrations.map(reg => this.serialize(reg).data),
        { defaultPageSize: Number(pageSize) },
    );
}
