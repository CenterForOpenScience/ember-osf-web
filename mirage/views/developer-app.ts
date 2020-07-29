import { HandlerContext, Request, Schema } from 'ember-cli-mirage';
import faker from 'faker';

export function createDeveloperApp(this: HandlerContext, schema: Schema) {
    const attrs = {
        ...this.normalizedRequestAttrs('developer-app'),
        clientId: faker.internet.ip(),
        clientSecret: faker.random.uuid(),
    };
    return schema.developerApps.create(attrs);
}

export function updateDeveloperApp(this: HandlerContext, schema: Schema, request: Request) {
    const developerApp = schema.developerApps.find(request.params.id);
    const { data: { attributes } } = JSON.parse(request.requestBody);
    if (attributes.client_secret === null) {
        developerApp.update('clientSecret', faker.random.uuid());
        delete attributes.client_secret;
    }
    developerApp.update(attributes);
    return this.serialize(developerApp);
}
