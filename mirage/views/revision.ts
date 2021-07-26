import { HandlerContext, NormalizedRequestAttrs, Response, Schema } from 'ember-cli-mirage';
import { MirageRevisionModel } from 'ember-osf-web/mirage/factories/revision';

export function createNewRevision(this: HandlerContext, schema: Schema) {
    const attrs = this
        .normalizedRequestAttrs('revision') as unknown as Partial<NormalizedRequestAttrs<MirageRevisionModel>>;
    if (!attrs.registrationId) {
        return new Response(400, {}, {
            meta: { version: '2.9' },
            errors: [{ detail: 'YOU SHOULD GIMME A REGISTRATION!!!!!!!!!!!' }],
        });
    }
    const userId = schema.roots.first().currentUserId;
    let currentUser;

    if (userId) {
        currentUser = schema.users.find(userId);
    }
    const registration = schema.registrations.find(attrs.registrationId);
    const revisionResponses = registration.registrationResponses;
    const revision = schema.revisions.create({
        initiatedBy: currentUser,
        revisionResponses,
        registration,
    });

    return revision;
}
