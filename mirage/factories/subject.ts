import { Factory, ID, Trait, trait } from 'ember-cli-mirage';
import faker from 'faker';

import SubjectModel from 'ember-osf-web/models/subject';

export interface SubjectTraits {
    withChildren: Trait;
}

export interface MirageSubject extends SubjectModel {
    parentId: ID;
    childrenIds: ID[];
}

export default Factory.extend<MirageSubject & SubjectTraits>({
    taxonomyName: 'bepress',

    text() {
        return faker.lorem.words(3);
    },

    withChildren: trait<MirageSubject>({
        afterCreate(subject, server) {
            const count = faker.random.number({ min: 1, max: 4 });

            if (subject.text.includes('et')) {
                server.createList(
                    'subject',
                    count,
                    { parentId: subject.id },
                    'withChildren',
                );
            } else {
                server.createList(
                    'subject',
                    count,
                    { parentId: subject.id },
                );
            }
        },
    }),
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        subject: MirageSubject;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        subjects: MirageSubject;
    } // eslint-disable-line semi
}
