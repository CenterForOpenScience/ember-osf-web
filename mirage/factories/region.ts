import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

import RegionModel from 'ember-osf-web/models/region';

export default Factory.extend<RegionModel>({
    id() {
        return `${faker.address.countryCode()}-${faker.random.number()}`;
    },

    name() {
        return faker.address.country();
    },
});

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        regions: RegionModel;
    } // eslint-disable-line semi
}
