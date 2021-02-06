import { HandlerContext, ModelInstance, Request, Schema } from 'ember-cli-mirage';
import Contributor from 'ember-osf-web/models/contributor';
import Node from 'ember-osf-web/models/node';

export function createBibliographicContributor(
    node: ModelInstance<Node>,
    contributor: ModelInstance<Contributor>,
) {
    if (contributor.bibliographic) {
        node.bibliographicContributors.models.pushObject(contributor);
        node.save();
    }
}

export function addContributor(this: HandlerContext, schema: Schema, request: Request) {
    const attrs = this.normalizedRequestAttrs('contributor');
    const { draftId } = request.params;
    const draftRegistration = schema.draftRegistrations.find(draftId);
    let contributorCreated = null;
    if (attrs.usersId) {
        // The request comes with an id in the payload
        // That means we are adding an existing OSFUser as a contributor
        const user = schema.users.find(attrs.usersId);
        contributorCreated = schema.contributors.create({
            id: `${draftId}-${attrs.usersId}`,
            permission: attrs.permission,
            bibliographic: attrs.bibliographic,
            users: user,
            draftRegistration,
        });
    }
    if (attrs.email || attrs.fullName) {
        // The request comes without an id in the payload
        // That means we are inviting a user as a contributor
        const user = schema.users.create({ fullName: attrs.fullName });
        contributorCreated = schema.contributors.create({
            id: `${draftId}-${user.id}`,
            permission: attrs.permission,
            bibliographic: attrs.bibliographic,
            users: user,
            draftRegistration,
        });
    }
    return contributorCreated;
}
