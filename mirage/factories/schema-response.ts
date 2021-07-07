import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

import SchemaResponseModel from 'ember-osf-web/models/schema-response';

export default Factory.extend<SchemaResponseModel>({
    title() {
        return faker.lorem.word();
    },

    registrationResponses() {
        return {}; // need to return something maybe?
    },
    deleted: false,
    public: true,
});

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        schemaResponses: SchemaResponseModel;
    } // eslint-disable-line semi
}
