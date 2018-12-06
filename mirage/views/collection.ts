import { HandlerContext, ModelInstance, Schema } from 'ember-cli-mirage';

import Collection from 'ember-osf-web/models/collection';
import Registration from 'ember-osf-web/models/registration';

export function updateBookmarks(this: HandlerContext, schema: Schema) {
    const attrs = this.normalizedRequestAttrs();
    const { id: collId, linkedRegistrationIds } = attrs;
    const now = new Date();
    const bookmarksColl = schema.collections.find(collId) as ModelInstance<Collection>;
    if (!linkedRegistrationIds) {
        // remove registration from bookmarks collection.
        return bookmarksColl.update('dateModified', now);
    }
    // Bookmark registration
    const { linkedRegistrationIds: [regId] } = attrs;
    const registration = schema.registrations.find(regId) as ModelInstance<Registration>;
    bookmarksColl.update(
        { linkedRegistration_ids: [registration.id] },
    );
    return bookmarksColl;
}
