import { faker, HandlerContext, Request, Schema } from 'ember-cli-mirage';

import DeveloperApp from 'ember-osf-web/models/developer-app';

export function createDeveloperApp(this: HandlerContext, schema: Schema) {
    const attrs = {
        ...this.normalizedRequestAttrs('developerApp'),
        clientId: faker.internet.ip(),
        clientSecret: faker.random.uuid(),
    };
    return schema.developerApps.create<DeveloperApp>(attrs);
}

export function resetClientSecret(this: HandlerContext, schema: Schema, request: Request) {
    const developerApp = schema.developerApps.find<DeveloperApp>(request.params.id);
    developerApp.update('clientSecret', faker.random.uuid());
    return this.serialize(developerApp);
}
