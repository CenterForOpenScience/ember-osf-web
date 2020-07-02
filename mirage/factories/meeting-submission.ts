import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

import MeetingSubmission from 'ember-osf-web/models/meeting-submission';

export interface MirageMeetingSubmission extends MeetingSubmission {
    created: Date | string;
}

export default Factory.extend<MirageMeetingSubmission>({
    title() {
        return faker.lorem.sentence();
    },
    meetingCategory() {
        return faker.random.arrayElement([
            'poster',
            'talk',
        ]);
    },
    authorName() {
        return faker.name.findName();
    },
    downloadCount() {
        return faker.random.number({ min: 5, max: 500 });
    },
    dateCreated() {
        return faker.date.past(5, new Date(2020, 0, 0));
    },
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'meeting-submission': MirageMeetingSubmission;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        meetingSubmissions: MirageMeetingSubmission;
    } // eslint-disable-line semi
}
