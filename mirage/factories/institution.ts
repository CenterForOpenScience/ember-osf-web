import { Factory, faker } from 'ember-cli-mirage';

import Institution from 'ember-osf-web/models/institution';

export default Factory.extend<Institution>({
    name() {
        return faker.company.companyName();
    },
    description() {
        return faker.company.catchPhrase();
    },
    assets() {
        const asset = {
            logo: `https://www.gravatar.com/avatar/${faker.random.uuid().replace(/-/g, '')}?d=identicon&s=100`,
        };
        return asset;
    },
});
