import { Factory, faker } from 'ember-cli-mirage';

import InstitutionSummaryMetricModel from 'ember-osf-web/models/institution-summary-metric';

export default Factory.extend<InstitutionSummaryMetricModel>({
    publicProjectCount() {
        return faker.random.number({ min: 10, max: 100 });
    },
    privateProjectCount() {
        return faker.random.number({ min: 10, max: 100 });
    },
    userCount() {
        return faker.random.number({ min: 100, max: 1000 });
    },
});

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        institutionSummaryMetrics: InstitutionSummaryMetricModel;
    } // eslint-disable-line semi
}
