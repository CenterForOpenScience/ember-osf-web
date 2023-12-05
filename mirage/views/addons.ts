import { HandlerContext, ModelInstance, Request, Schema } from 'ember-cli-mirage';
import { process } from './utils';

export function internalUserAuthorizedStorageAccountList(this: HandlerContext, schema: Schema, request: Request) {
    const { userGuid } = request.params;
    const internalUser = schema.internalUsers.find(userGuid);
    const authorizedStorageAccounts = internalUser.attrs.authorizedStorageAccountIds.map(
        (id: string) => schema.authorizedStorageAccounts.find(id),
    );
    const data = authorizedStorageAccounts.map((account: ModelInstance) => this.serialize(account).data);
    return process(schema, request, this, data);
}
