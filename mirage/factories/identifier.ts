import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

import Identifier from 'ember-osf-web/models/identifier';

export default Factory.extend<Identifier>({
    category: 'doi',
    value() {
        return faker.fake('10.5555/{{company.bsNoun}}');
    },
});

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        identifiers: Identifier;
    } // eslint-disable-line semi
}
