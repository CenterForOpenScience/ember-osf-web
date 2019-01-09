import { HandlerContext, Request, Response, Schema } from 'ember-cli-mirage';

import { process } from './utils';

export function registrationDetail(this: HandlerContext, schema: Schema, request: Request) {
    const { id } = request.params;
    const registration = schema.registrations.find(id);

    if (registration.embargoed && (!registration.currentUserPermissions.length)) {
        return new Response(404, {}, {
            meta: { version: '2.9' },
            errors: [{ detail: 'Not found.' }],
        });
    }

    const { data } = process(schema, request, this, [this.serialize(registration).data]);

    return { data: data[0] };
}
