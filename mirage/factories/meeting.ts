import { capitalize } from '@ember/string';
import { Factory, faker } from 'ember-cli-mirage';

import Meeting from 'ember-osf-web/models/meeting';

export default Factory.extend<Meeting>({
    name() {
        return faker.random.arrayElement([
            faker.company.bs,
            faker.company.catchPhrase,
        ])().split(' ').map(word => capitalize(word)).join(' ');
    },
    submissionsCount() {
        return faker.random.number({ min: 5, max: 500 });
    },
    location() {
        return faker.random.arrayElement([
            `${faker.address.city()}, ${faker.address.stateAbbr()}, USA`,
            `${faker.address.city()}, ${faker.address.country()}`,
        ]);
    },
    startDate() {
        return faker.date.past(5, new Date(2020, 0, 0));
    },
    endDate() {
        return faker.date.past(5, new Date(2020, 0, 0));
    },
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        meeting: Meeting;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        meetings: Meeting;
    } // eslint-disable-line semi
}
