import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

import ResourceModel from 'ember-osf-web/models/resource';

export default Factory.extend<ResourceModel>({
    pid() {
        return faker.internet.url();
    },
    name(){
        return faker.lorem.sentence();
    },
    description() {
        return faker.lorem.paragraph();
    },
    resourceType() {
        return faker.random.arrayElement([1, 11]);
    },
    finalized: true,
});

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        resources: ResourceModel;
    } // eslint-disable-line semi
}
