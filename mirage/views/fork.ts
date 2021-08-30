import { HandlerContext, ModelInstance, NormalizedRequestAttrs, Schema } from 'ember-cli-mirage';
import { MirageNode } from '../factories/node';
import { MirageRegistration } from '../factories/registration';

export function createFork(this: HandlerContext, schema: Schema) {
    const attrs = this.normalizedRequestAttrs('node') as Partial<NormalizedRequestAttrs<MirageNode>>;
    const nodeId = attrs.id;
    delete attrs.id;
    const node = schema.nodes.find(nodeId!) as ModelInstance<MirageNode>;
    const fork = schema.nodes.create({
        forkedFrom: node,
        category: node.category,
        fork: true,
        title: `Fork of ${node.title}`,
        description: node.description,
        ...attrs,
    });

    const userId = schema.roots.first().currentUserId;
    const currentUser = schema.users.find(userId!);
    node.contributors.models.forEach(contributor => {
        schema.contributors.create({ node: fork, users: contributor.users });
    });
    schema.contributors.create({ node: fork, users: currentUser, index: 0 });

    return fork;
}

export function createRegistrationFork(this: HandlerContext, schema: Schema) {
    const attrs = this.normalizedRequestAttrs('node') as Partial<NormalizedRequestAttrs<MirageNode>>;
    const registrationId = attrs.id;
    delete attrs.id;
    const registration = schema.registrations.find(registrationId!) as ModelInstance<MirageRegistration>;
    const fork = schema.nodes.create({
        forkedFrom: registration,
        category: registration.category,
        fork: true,
        title: `Fork of ${registration.title}`,
        description: registration.description,
        ...attrs,
    });

    const userId = schema.roots.first().currentUserId;
    const currentUser = schema.users.find(userId!);
    registration.contributors.models.forEach(contributor => {
        schema.contributors.create({ node: fork, users: contributor.users });
    });
    schema.contributors.create({ node: fork, users: currentUser, index: 0 });

    return fork;
}
