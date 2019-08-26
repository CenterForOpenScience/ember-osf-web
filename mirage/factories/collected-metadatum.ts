import { Factory, faker } from 'ember-cli-mirage';

import CollectedMetadatum from 'ember-osf-web/models/collected-metadatum';

import { guid, guidAfterCreate } from './utils';

export default Factory.extend<CollectedMetadatum>({
    id: guid('collected-metadatum'),
    afterCreate(collectedMetadatum, server) {
        guidAfterCreate(collectedMetadatum, server);
        if (!collectedMetadatum.collectedType) {
            const collectedType = faker.random.arrayElement(collectedMetadatum.collection.collectedTypeChoices);
            collectedMetadatum.update({ collectedType });
        }
        if (!collectedMetadatum.issue) {
            const issue = faker.random.arrayElement(collectedMetadatum.collection.issueChoices);
            collectedMetadatum.update({ issue });
        }
        if (!collectedMetadatum.programArea) {
            const programArea = faker.random.arrayElement(collectedMetadatum.collection.programAreaChoices);
            collectedMetadatum.update({ programArea });
        }
        if (!collectedMetadatum.status) {
            const status = faker.random.arrayElement(collectedMetadatum.collection.statusChoices);
            collectedMetadatum.update({ status });
        }
        if (!collectedMetadatum.volume) {
            const volume = faker.random.arrayElement(collectedMetadatum.collection.volumeChoices);
            collectedMetadatum.update({ volume });
        }
    },
});

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        collectedMetadatum: CollectedMetadatum;
    } // eslint-disable-line semi
}
