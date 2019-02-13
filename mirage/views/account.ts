import { HandlerContext, Request, Schema } from 'ember-cli-mirage';

export function getAccount(this: HandlerContext, schema: Schema, request: Request) {
    const account = schema.accounts.findBy({ addonId: request.params.addonID });
    const response = this.serialize(account, 'account');

    return response;

    // console.log(response);

    // return response;

    // const userSetting = schema.userSettings.findBy({ userId: request.params.id });
    // const { twoFactorEnabled, twoFactorConfirmed } = userSetting;
    // if (twoFactorEnabled && !twoFactorConfirmed) {
    // userSetting.secret = 'S3CR3TSHH';
    // }
    // const response = this.serialize(userSetting, 'user-setting');
    // return response;
}
