import { HandlerContext, Schema } from 'ember-cli-mirage';

export function createDraftRegistration(this: HandlerContext, schema: Schema) {
    const attrs = this.normalizedRequestAttrs('draft-registration');
    const now = (new Date()).toISOString();
    const userId = schema.roots.first().currentUserId;
    let currentUser;

    if (userId) {
        currentUser = schema.users.find(userId);
    }

    const draftRegistration = schema.draftRegistrations.create({
        datetimeInitiated: now,
        datetimeUpdated: now,
        initiator: currentUser,
        tags: [],
        ...attrs,
    });

    return draftRegistration;
}
