import { Factory, faker } from 'ember-cli-mirage';

import RegistrationSchema from 'ember-osf-web/models/registration-schema';

// eslint-disable-next-line no-spaced-func, func-call-spacing
export default Factory.extend<RegistrationSchema & { schemaNoConflict: () => RegistrationSchema['schema'] }>({
    active: true,
    name() {
        return faker.lorem.sentence().replace('.', '');
    },
    schemaVersion: 2,
    // To avoid collision with mirage schema. Will be changed to 'schema' in serializer.
    schemaNoConflict() {
        return {
            description: faker.lorem.sentence(),
            title: faker.lorem.sentence().replace('.', ''),
            version: 2,
            active: true,
            pages: [],
            name: faker.lorem.sentence().replace('.', ''),
            config: {
                hasFiles: false,
            },
        };
    },
});
