import { HandlerContext, ModelInstance, Request, Schema } from 'ember-cli-mirage';

import ExternalAccountsModel from 'ember-osf-web/models/external-accounts';
import { process } from './utils';

export function externalAccountDetail(this: HandlerContext, schema: Schema, request: Request) {
    const { accountID } = request.params;
    const externalAccount = schema.externalAccounts.find(accountID);

    const serializedExternalAccount = this.serialize(externalAccount);
    const { data } = process(schema, request, this, [serializedExternalAccount.data]);

    return {
        data: data[0],
        meta: serializedExternalAccount.meta,
    };
}

export function externalAccountList(this: HandlerContext, schema: Schema, request: Request) {
    const userAddons = schema.users
        .find(request.params.userID)['userAddons']
        .models;
    const externalAccounts = userAddons.length ? userAddons[0].externalAccounts.models : null;
    if (externalAccounts) {
        externalAccounts
            .filter( (item: ModelInstance<ExternalAccountsModel>) => item.provider.id === request.params.addonID )
            .map((model: ModelInstance<ExternalAccountsModel>) => this.serialize(model).data);

        const json = process(schema, request, this, externalAccounts, { defaultSortKey: 'id' });
        return json;
    }
    return {};
}
