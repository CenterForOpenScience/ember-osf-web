import { HandlerContext, Request, Schema } from 'ember-cli-mirage';

export function updateUserSettings(this: HandlerContext, schema: Schema, request: Request) {
    const attrs = this.normalizedRequestAttrs();
    const existingSettings = schema.userSettings.find(request.params.id);
    const { twoFactorEnabled } = existingSettings;
    let { secret } = existingSettings;

    if (attrs.twoFactorEnabled === false) {
        secret = '';
    }
    if (attrs.twoFactorEnabled && !twoFactorEnabled) {
        secret = 's3cr3tshh';
    }
    const userSettings = schema.userSettings.update({
        ...attrs,
        twoFactorConfirmed: twoFactorEnabled && secret === '',
    });
    return userSettings;
}
