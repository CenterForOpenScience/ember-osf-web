import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

import OutputModel from 'ember-osf-web/models/output';

export default Factory.extend<OutputModel>({
    pid() {
        return faker.internet.url();
    },
    name(){
        return faker.lorem.sentence();
    },
    description() {
        return faker.lorem.paragraph();
    },
    outputType() {
        return faker.random.arrayElement([1, 11]);
    },
    finalized: true,
});

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        outputs: OutputModel;
    } // eslint-disable-line semi
}
