import { HandlerContext, Request, Schema } from 'ember-cli-mirage';

export function getAccount(this: HandlerContext, schema: Schema, request: Request) {
    const account = schema.accounts.findBy({ addonId: request.params.addonID });
    const response = this.serialize(account, 'account');

    return response;
}

export function deleteAccount(this: HandlerContext, schema: Schema, request: Request) {
    const { id } = request.params;
    const account = schema.accounts.findBy({ id });

    account.destroy();
}
