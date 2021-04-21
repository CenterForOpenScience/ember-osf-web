import { HandlerContext, NormalizedRequestAttrs, Schema } from 'ember-cli-mirage';
import { MirageDraftRegistration } from 'ember-osf-web/mirage/factories/draft-registration';
import { NodeCategory } from 'ember-osf-web/models/node';
import { Permission } from 'ember-osf-web/models/osf-model';

export function createDraftRegistration(this: HandlerContext, schema: Schema) {
    const attrs = this
        .normalizedRequestAttrs('draft-registration') as
        unknown as Partial<NormalizedRequestAttrs<MirageDraftRegistration>>;
    const now = new Date();
    const userId = schema.roots.first().currentUserId;
    let currentUser;

    if (userId) {
        currentUser = schema.users.find(userId);
    }

    const branchedFromNode = schema.draftNodes.create({});
    const draftRegistration = schema.draftRegistrations.create({
        datetimeInitiated: now,
        datetimeUpdated: now,
        initiator: currentUser,
        tags: [],
        category: NodeCategory.Uncategorized,
        hasProject: false,
        branchedFromId: attrs.branchedFromId
            ? { id: attrs.branchedFromId.id, type: 'node' }
            : { id: branchedFromNode.id, type: 'draft-node' },
        ...attrs,
    });

    schema.contributors.create({
        index: 0,
        draftRegistration,
        users: currentUser,
        bibliographic: true,
        permission: Permission.Admin,
    });
    return draftRegistration;
}
