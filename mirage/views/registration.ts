import { HandlerContext, ModelInstance, NormalizedRequestAttrs, Request, Response, Schema } from 'ember-cli-mirage';
import faker from 'faker';

import DraftNodeModel from 'ember-osf-web/models/draft-node';
import RegistrationModel, { RegistrationReviewStates } from 'ember-osf-web/models/registration';
import { MirageNode } from '../factories/node';
import { MirageRegistration } from '../factories/registration';

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
    const serializedRegistration = this.serialize(registration);
    const { data } = process(schema, request, this, [serializedRegistration.data]);

    return {
        data: data[0],
        meta: serializedRegistration.meta,
    };
}

export function createNodeFromDraftNode(
    schema: Schema, draftNode: ModelInstance<DraftNodeModel>,
): ModelInstance<MirageNode> {
    return schema.nodes.create({ files: draftNode.files.models });
}

export function createRegistration(this: HandlerContext, schema: Schema) {
    const attrs = this.normalizedRequestAttrs('registration') as Partial<NormalizedRequestAttrs<MirageRegistration>>;
    const randomNum = faker.random.number();
    const registrationGuid = guid('registration');
    const id = registrationGuid(randomNum);
    const draft = schema.draftRegistrations.find(attrs.draftRegistrationId!);

    schema.guids.create({ id, referentType: 'registration' });
    let newReg;
    if (draft.hasProject) {
        const branchedFrom = draft.branchedFrom as ModelInstance<MirageNode>;
        newReg = schema.registrations.create({
            id,
            embargoed: Boolean(attrs.embargoEndDate),
            dateRegistered: new Date(),
            registeredFrom: branchedFrom,
            registrationSchema: draft.registrationSchema,
            tags: branchedFrom.tags || [],
            category: branchedFrom.category,
            contributors: draft.contributors.models,
            currentUserPermissions: draft.currentUserPermissions,
            reviewsState: RegistrationReviewStates.Accepted,
            ...attrs,
        });
    } else {
        const branchedFrom = createNodeFromDraftNode(schema, draft.branchedFrom as ModelInstance<DraftNodeModel>);
        newReg = schema.registrations.create({
            id,
            embargoed: Boolean(attrs.embargoEndDate),
            dateRegistered: new Date(),
            registeredFrom: branchedFrom,
            registrationSchema: draft.registrationSchema,
            tags: [],
            contributors: draft.contributors.models,
            currentUserPermissions: draft.currentUserPermissions,
            reviewsState: RegistrationReviewStates.Accepted,
            ...attrs,
        });
    }

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
