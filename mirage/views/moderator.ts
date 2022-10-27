import { HandlerContext, ModelInstance, Request, Schema } from 'ember-cli-mirage';
import { MirageRegistrationProvider } from 'ember-osf-web/mirage/factories/registration-provider';
import { MirageCollectionProvider } from 'ember-osf-web/mirage/factories/collection-provider';

export function addModerator(this: HandlerContext, schema: Schema, request: Request) {
    const { parentID } = request.params;
    const attrs = this.normalizedRequestAttrs('moderator');
    let provider: ModelInstance<MirageRegistrationProvider | MirageCollectionProvider> =
        schema.registrationProviders.find(parentID);
    if (request.url.includes('collections')) {
        provider = schema.collectionProviders.find(parentID);
    }
    let moderatorCreated = null;
    if (attrs.id) {
        // The request comes with an id in the payload
        // That means we are adding an existing OSFUser as a moderator
        const user = schema.users.find(attrs.id);
        moderatorCreated = schema.moderators.create({
            id: attrs.id,
            fullName: user.fullName,
            permissionGroup: attrs.permissionGroup,
            user,
            provider,
        });
    }
    if (attrs.email && attrs.fullName) {
        // The request comes without an id in the payload
        // That means we are inviting a user as a moderator
        const user = schema.users.create({ fullName: attrs.fullName });
        moderatorCreated = schema.moderators.create({
            id: user.id,
            fullName: user.fullName,
            permissionGroup: attrs.permissionGroup,
            user,
            provider,
        });
    }
    return moderatorCreated;
}
