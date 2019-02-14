import { Factory, faker } from 'ember-cli-mirage';

import DeveloperApp from 'ember-osf-web/models/developer-app';

export default Factory.extend<DeveloperApp>({
    id(i: number) {
        return i.toString().padStart(5, '0');
    },

    name() {
        return faker.lorem.words(4);
    },

    description: faker.lorem.sentence,

    homeUrl: faker.internet.url,

    callbackUrl() {
        return `https://${faker.internet.domainName()}`;
    },

    clientId() {
        return faker.internet.ip();
    },
    clientSecret() {
        return faker.random.uuid();
    },
});

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        developerApps: DeveloperApp;
    } // eslint-disable-line semi
}
