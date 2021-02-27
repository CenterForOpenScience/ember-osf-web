import { HandlerContext, NormalizedRequestAttrs, Schema } from 'ember-cli-mirage';
import { MirageDraftRegistration } from 'ember-osf-web/mirage/factories/draft-registration';

export function createDraftRegistration(this: HandlerContext, schema: Schema) {
    const attrs = this.normalizedRequestAttrs('draft-registration') as NormalizedRequestAttrs<MirageDraftRegistration>;
    const now = (new Date()).toISOString();
    const userId = schema.roots.first().currentUserId;
    let currentUser;
    let branchedFromNode;
    let draftRegistration;

    if (userId) {
        currentUser = schema.users.find(userId);
    }
    if (!attrs.branchedFromId) {
        branchedFromNode = schema.draftNodes.create({});
        draftRegistration = schema.draftRegistrations.create({
            datetimeInitiated: now,
            datetimeUpdated: now,
            initiator: currentUser,
            tags: [],
            hasProject: false,
            branchedFrom: branchedFromNode,
            ...attrs,
        });
    } else {
        draftRegistration = schema.draftRegistrations.create({
            datetimeInitiated: now,
            datetimeUpdated: now,
            initiator: currentUser,
            tags: [],
            branchedFromId: attrs.branchedFromId.id,
            hasProject: true,
            ...attrs,
        });
    }
    return draftRegistration;
}
