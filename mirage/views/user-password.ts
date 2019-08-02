import { HandlerContext, Response } from 'ember-cli-mirage';

export function updatePassword(this: HandlerContext) {
    const attrs = this.normalizedRequestAttrs('user-password');
    const existingPassword = 'oldpassword';

    if (attrs.existingPassword !== undefined) {
        if (attrs.existingPassword === existingPassword) {
            return new Response(204, undefined, undefined);
        }
        return new Response(409, { 'Content-Type': 'application/vnd.api+json' }, {
            errors: [{
                status: 409,
                detail: 'Old password is invalid.',
            }],
        });
    }
    return new Response(400, { 'Content-Type': 'application/vnd.api+json' }, {
        errors: [{
            status: 400,
            detail: 'Password must not be blank.',
        }],
    });
}
