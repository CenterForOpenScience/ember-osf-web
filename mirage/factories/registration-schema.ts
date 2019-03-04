import { Factory, faker } from 'ember-cli-mirage';

import RegistrationSchema from 'ember-osf-web/models/registration-schema';

export interface MirageRegistrationSchema extends RegistrationSchema {
    schemaNoConflict?: RegistrationSchema['schema'];
}

export default Factory.extend<MirageRegistrationSchema>({
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

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'registration-schema': MirageRegistrationSchema;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        registrationSchemas: MirageRegistrationSchema;
    } // eslint-disable-line semi
}
