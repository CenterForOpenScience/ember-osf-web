import { HandlerContext, Schema } from 'ember-cli-mirage';

export function bookmarksRegistrationAdd(this: HandlerContext, schema: Schema) {
    const { parentID: collId } = this.request.params;
    const { data: [{ id: regId, type }] } = JSON.parse(this.request.requestBody);
    const bookmarksColl = schema.collections.find(collId);

    const existingLinkedRegistrations: Array<string|number> = bookmarksColl.linkedRegistrations.models.mapBy('id');
    const linkedRegistrations = [regId, ...existingLinkedRegistrations];

    return { data: linkedRegistrations.map(id => ({ id, type })) };
}

export function bookmarksRegistrationDelete(this: HandlerContext, schema: Schema) {
    const { id: regId, parentID } = this.request.params;
    const bookmarksColl = schema.collections.find(parentID);
    const existingLinkedRegistrations: Array<string|number> = bookmarksColl.linkedRegistrations.models.mapBy('id');
    const linkedRegistrations = existingLinkedRegistrations.splice(existingLinkedRegistrations.indexOf(regId), 1);

    return { data: linkedRegistrations.map(id => ({ id, type: 'registrations' })) };
}
