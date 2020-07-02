import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

import InstitutionDepartmentModel from 'ember-osf-web/models/institution-department';

export default Factory.extend<InstitutionDepartmentModel>({
    name() {
        return faker.lorem.word();
    },
    numberOfUsers() {
        return faker.random.number({ min: 100, max: 1000 });
    },
});

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        institutionDepartment: InstitutionDepartmentModel;
    } // eslint-disable-line semi
}
