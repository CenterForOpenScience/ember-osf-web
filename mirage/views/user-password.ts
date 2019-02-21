import { HandlerContext } from 'ember-cli-mirage';

export function updatePassword(this: HandlerContext) {
    const attrs = this.normalizedRequestAttrs('userSetting');
    const currentPassword = 'oldpassword';

    if (attrs.password !== undefined) {
        if (attrs.password === currentPassword) {
            return true;
        }
    }
    return false;
}
