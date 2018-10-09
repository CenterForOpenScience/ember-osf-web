import { Factory, faker } from 'ember-cli-mirage';

import Scope from 'ember-osf-web/models/scope';

export default Factory.extend<Scope>({
    id() {
        return faker.lorem.word();
    },

    description() {
        return faker.lorem.sentence();
    },
});
