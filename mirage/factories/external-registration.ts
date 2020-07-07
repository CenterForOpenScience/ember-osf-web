import { Factory, faker } from 'ember-cli-mirage';

import { MirageExternalRegistration } from 'ember-osf-web/mirage/models/external-registration';

export default Factory.extend<MirageExternalRegistration>({
    title() {
        return faker.random.words();
    },
    description() {
        return faker.lorem.sentence();
    },
    dateModified() {
        return faker.date.past(4).toString();
    },
    dateRegistered() {
        return faker.date.past(7).toString();
    },
});
