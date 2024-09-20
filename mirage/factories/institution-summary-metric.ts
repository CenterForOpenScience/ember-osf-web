import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

import InstitutionSummaryMetricModel from 'ember-osf-web/models/institution-summary-metric';

export default Factory.extend<InstitutionSummaryMetricModel>({
    publicProjectCount() {
        return faker.random.number({ min: 10, max: 100 });
    },
    privateProjectCount() {
        return faker.random.number({ min: 10, max: 100 });
    },
    userCount() {
        return faker.random.number({ min: 10, max: 50});
    },
    publicRegistrationCount() {
        return faker.random.number({ min: 100, max: 1000 });
    },
    embargoedRegistrationCount() {
        return faker.random.number({ min: 0, max: 25});
    },
    preprintCount() {
        return faker.random.number({ min: 15, max: 175});
    },
    storageByteCount() {
        return faker.random.number({ min: 1000 * 100, max: 1000 * 1000 * 100 });
    },
    publicFileCount() {
        return faker.random.number({ min: 15, max: 1000 });
    },
    monthlyActiveUserCount() {
        return faker.random.number({ min: 10, max: 100 * 10 });
    },
    monthlyLoggedInUserCount() {
        return faker.random.number({ min: 10, max: 100 * 100 });
    },
});

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        institutionSummaryMetrics: InstitutionSummaryMetricModel;
    } // eslint-disable-line semi
}
