import { Factory, faker } from 'ember-cli-mirage';

import MeetingSubmission from 'ember-osf-web/models/meeting-submission';

export default Factory.extend<MeetingSubmission>({
    title() {
        return faker.lorem.sentence();
    },
    category() {
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
    created() {
        return faker.date.past(5, new Date(2020, 0, 0));
    },
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        meetingSubmission: MeetingSubmission;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        meetingSubmissions: MeetingSubmission;
    } // eslint-disable-line semi
}
