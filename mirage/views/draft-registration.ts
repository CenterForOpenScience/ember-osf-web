import { HandlerContext, NormalizedRequestAttrs, Schema } from 'ember-cli-mirage';
import { MirageDraftRegistration } from 'ember-osf-web/mirage/factories/draft-registration';
import { NodeCategory } from 'ember-osf-web/models/node';
import { Permission } from 'ember-osf-web/models/osf-model';

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
            category: NodeCategory.Uncategorized,
            hasProject: false,
            branchedFrom: branchedFromNode,
            ...attrs,
        });
        schema.contributors.create({
            index: 0,
            draftRegistration,
            users: currentUser,
            bibliographic: true,
            permission: Permission.Admin,
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
