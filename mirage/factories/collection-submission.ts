import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

import CollectionSubmission from 'ember-osf-web/models/collection-submission';

import { guid, guidAfterCreate } from './utils';

export default Factory.extend<CollectionSubmission>({
    id: guid('collection-submission'),
    afterCreate(collectionSubmission, server) {
        guidAfterCreate(collectionSubmission, server);
        if (!collectionSubmission.collectedType) {
            const collectedType = faker.random.arrayElement(collectionSubmission.collection.collectedTypeChoices);
            collectionSubmission.update({ collectedType });
        }
        if (!collectionSubmission.issue) {
            const issue = faker.random.arrayElement(collectionSubmission.collection.issueChoices);
            collectionSubmission.update({ issue });
        }
        if (!collectionSubmission.programArea) {
            const programArea = faker.random.arrayElement(collectionSubmission.collection.programAreaChoices);
            collectionSubmission.update({ programArea });
        }
        if (!collectionSubmission.status) {
            const status = faker.random.arrayElement(collectionSubmission.collection.statusChoices);
            collectionSubmission.update({ status });
        }
        if (!collectionSubmission.volume) {
            const volume = faker.random.arrayElement(collectionSubmission.collection.volumeChoices);
            collectionSubmission.update({ volume });
        }
        if (!collectionSubmission.studyDesign) {
            const studyDesign = faker.random.arrayElement(collectionSubmission.collection.studyDesignChoices);
            collectionSubmission.update({ studyDesign });
        }
        if (!collectionSubmission.schoolType) {
            const schoolType = faker.random.arrayElement(collectionSubmission.collection.schoolTypeChoices);
            collectionSubmission.update({ schoolType });
        }
    },
});

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        collectionSubmission: CollectionSubmission;
    } // eslint-disable-line semi
}
