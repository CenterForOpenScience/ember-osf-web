import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

import Scope from 'ember-osf-web/models/scope';

export default Factory.extend<Scope>({
    id() {
        return faker.lorem.word();
    },

    description() {
        return faker.lorem.sentence();
    },
});

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        scopes: Scope;
    } // eslint-disable-line semi
}
