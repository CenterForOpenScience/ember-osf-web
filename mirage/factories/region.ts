import { Factory, faker } from 'ember-cli-mirage';

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
