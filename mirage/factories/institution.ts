import { Factory, faker } from 'ember-cli-mirage';

import Institution from 'ember-osf-web/models/institution';

import { randomGravatar } from '../utils';

export default Factory.extend<Institution>({
    name() {
        return faker.company.companyName();
    },
    description() {
        return faker.company.catchPhrase();
    },
    assets() {
        return {
            logo: randomGravatar(100),
        };
    },
});
