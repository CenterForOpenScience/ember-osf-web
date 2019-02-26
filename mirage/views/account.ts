import { HandlerContext, Request, Schema } from 'ember-cli-mirage';

export function getAccount(this: HandlerContext, schema: Schema, request: Request) {
    const account = schema.accounts.findBy({ addonId: request.params.addonID });
    const response = this.serialize(account, 'account');

    return response;
}

export function saveAccount(this: HandlerContext, schema: Schema) {
    const attrs = { ...this.normalizedRequestAttrs('account') };

    return schema.accounts.create(attrs);
}

export function updateAccount(this: HandlerContext, schema: Schema, request: Request) {
    const { id } = request.params;
    const attrs = this.normalizedRequestAttrs('account');

    return schema.accounts.findBy({ id }).update(attrs);
}

export function deleteAccount(this: HandlerContext, schema: Schema, request: Request) {
    const { id } = request.params;
    const account = schema.accounts.findBy({ id });

    account.destroy();
}
