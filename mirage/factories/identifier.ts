import { Factory, faker } from 'ember-cli-mirage';

import Identifier from 'ember-osf-web/models/identifier';

export default Factory.extend<Identifier>({
    category: 'doi',
    value() {
        return faker.fake('10.5555/{{company.bsNoun}}');
    },
});
