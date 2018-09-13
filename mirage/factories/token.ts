import { Factory, faker } from 'ember-cli-mirage';

import Token from 'ember-osf-web/models/token';

export default Factory.extend<Token>({
    name() {
        return faker.lorem.words(2);
    },
});
