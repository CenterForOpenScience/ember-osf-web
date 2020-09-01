import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

import Moderator from 'ember-osf-web/models/moderator';

export default Factory.extend<Moderator>({
    permissionGroup() {
        return 'moderator'; // TODO: get the permissions from the moderator model and choose one randomly?
    },
    fullName() {
        return `${faker.name.firstName()} ${faker.name.lastName()}`;
    },
    email() {
        return faker.internet.email;
    },
});

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        moderator: Moderator;
    } // eslint-disable-line semi
}
