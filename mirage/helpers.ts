import { ModelAttrs, ModelInstance, Server } from 'ember-cli-mirage';
import faker from 'faker';

import DraftRegistration from 'ember-osf-web/models/draft-registration';

import { DraftRegistrationTraits } from './factories/draft-registration';
import { MirageNode, NodeTraits } from './factories/node';
import { MirageRegistration, RegistrationTraits } from './factories/registration';

export function registerNode(
    server: Server,
    node: ModelInstance<MirageNode>,
    props: Partial<ModelAttrs<MirageRegistration>> = {},
    ...traits: string[] // eslint-disable-line  comma-dangle
) {
    const registration = server.create('registration', {
        registeredFrom: node,
        category: node.category,
        title: node.title,
        description: node.description,
        registrationSchema: faker.random.arrayElement(
            server.schema.registrationSchemas.all().models,
        ),
        ...props,
    }, ...traits);
    node.contributors.models.forEach(
        contributor => server.create('contributor', { node: registration, users: contributor.users }),
    );
}

export function registerNodeMultiple(
    server: Server,
    node: ModelInstance<MirageNode>,
    count: number,
    props: Partial<ModelAttrs<MirageRegistration>> = {},
    ...traits: string[] // eslint-disable-line  comma-dangle
) {
    const registrations = [];
    for (let i = 0; i < count; i++) {
        registrations.push(registerNode(server, node, props, ...traits));
    }
    return registrations;
}

export function draftRegisterNode(
    server: Server,
    node: ModelInstance<MirageNode>,
    props: Partial<ModelAttrs<DraftRegistration>> = {},
    ...traits: Array<keyof DraftRegistrationTraits> // eslint-disable-line  comma-dangle
) {
    return server.create('draft-registration', {
        branchedFrom: node,
        initiator: node.contributors.models.length ? node.contributors.models[0].users : undefined,
        registrationSchema: faker.random.arrayElement(
            server.schema.registrationSchemas.all().models,
        ),
        ...props,
    }, ...traits);
}

export function draftRegisterNodeMultiple(
    server: Server,
    node: ModelInstance<MirageNode>,
    count: number,
    props: Partial<ModelAttrs<DraftRegistration>> = {},
    ...traits: Array<keyof DraftRegistrationTraits> // eslint-disable-line  comma-dangle
) {
    const draftRegistrations = [];
    for (let i = 0; i < count; i++) {
        draftRegistrations.push(draftRegisterNode(server, node, props, ...traits));
    }
    return draftRegistrations;
}

export function forkNode(
    server: Server,
    node: ModelInstance<MirageNode>,
    props: Partial<ModelAttrs<MirageNode>> = {},
    ...traits: Array<keyof NodeTraits> // eslint-disable-line  comma-dangle
) {
    const nodeFork = server.create('node', {
        forkedFrom: node,
        category: node.category,
        fork: true,
        title: `Fork of ${node.title}`,
        description: node.description,
        ...props,
    }, ...traits);
    node.contributors.models.forEach(
        contributor => server.create('contributor', { node: nodeFork, users: contributor.users }),
    );
    return nodeFork;
}

export function forkRegistration(
    server: Server,
    registration: ModelInstance<MirageRegistration>,
    props: Partial<ModelAttrs<MirageNode>> = {},
    ...traits: Array<keyof RegistrationTraits> // eslint-disable-line  comma-dangle
) {
    const nodeFork = server.create(
        'node',
        {
            forkedFrom: registration,
            category: registration.category,
            fork: true,
            title: `Fork of ${registration.title}`,
            description: registration.description,
            ...props,
        },
        ...traits,
    );
    registration.contributors.models.forEach(
        contributor => server.create('contributor', { node: nodeFork, users: contributor.users }),
    );
    return nodeFork;
}
