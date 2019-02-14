import { HandlerContext, Schema } from 'ember-cli-mirage';

export function updateBookmarks(
    this: HandlerContext,
    schema: Schema,
    request: any,
) {
    const { id: collId } = this.request.params;
    const { data: [{ id: regId, type }] } = JSON.parse(request.requestBody);
    const bookmarksColl = schema.collections.find(collId);

    const existingLinkedRegistrations: string[] = bookmarksColl.linkedRegistrations.models.mapBy('id');
    const linkedRegistrations = request.method === 'POST' ?
        [regId, ...existingLinkedRegistrations] :
        existingLinkedRegistrations.splice(existingLinkedRegistrations.indexOf(regId), 1);

    return { data: linkedRegistrations.map(id => ({ id, type })) };
}
