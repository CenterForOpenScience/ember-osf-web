import { HandlerContext, Schema } from 'ember-cli-mirage';

export function updateBookmarks(
    this: HandlerContext,
    schema: Schema,
) {
    const { parentID: collId } = this.request.params;
    const { data: [{ id: regId, type }] } = JSON.parse(this.request.requestBody);

    const bookmarksColl = schema.collections.find(collId);

    const existingLinkedRegistrations: Array<string|number> = bookmarksColl.linkedRegistrationIds;
    const linkedRegistrations = this.request.method === 'POST' ?
        [regId, ...existingLinkedRegistrations] :
        existingLinkedRegistrations.splice(existingLinkedRegistrations.indexOf(regId), 1);

    return { data: linkedRegistrations.map(id => ({ id, type })) };
}
