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
    callbackUrl: faker.internet.url,

    clientId() {
        return faker.internet.ip();
    },
    clientSecret() {
        return faker.random.uuid();
    },
});
