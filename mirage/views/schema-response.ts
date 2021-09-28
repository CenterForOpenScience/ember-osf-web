import { HandlerContext, NormalizedRequestAttrs, Response, Schema } from 'ember-cli-mirage';
import { MirageSchemaResponseModel } from 'ember-osf-web/mirage/factories/schema-response';
import { RevisionReviewStates } from 'ember-osf-web/models/schema-response';

export function createNewSchemaResponse(this: HandlerContext, schema: Schema) {
    const attrs = this.normalizedRequestAttrs(
        'schema-response',
    ) as unknown as Partial<NormalizedRequestAttrs<MirageSchemaResponseModel>>;
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
    const revision = schema.schemaResponses.create({
        initiatedBy: currentUser,
        reviewsState: RevisionReviewStates.RevisionInProgress,
        revisionResponses,
        registration,
        registrationSchema: registration.registrationSchema,
        dateCreated: new Date(),
        dateModified: new Date(),
        isPendingCurrentUserApproval: true,
    });
    return revision;
}
