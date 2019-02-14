import { faker, HandlerContext, Request, Schema } from 'ember-cli-mirage';

export function createDeveloperApp(this: HandlerContext, schema: Schema) {
    const attrs = {
        ...this.normalizedRequestAttrs('developer-app'),
        clientId: faker.internet.ip(),
        clientSecret: faker.random.uuid(),
    };
    return schema.developerApps.create(attrs);
}

export function resetClientSecret(this: HandlerContext, schema: Schema, request: Request) {
    const developerApp = schema.developerApps.find(request.params.id);
    developerApp.update('clientSecret', faker.random.uuid());
    return this.serialize(developerApp);
}
