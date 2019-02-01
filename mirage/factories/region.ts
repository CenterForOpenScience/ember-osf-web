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
