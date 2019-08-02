import { capitalize } from '@ember/string';
import { Factory, faker } from 'ember-cli-mirage';

import Meeting from 'ember-osf-web/models/meeting';

import { randomGravatar } from '../utils';

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
    logoUrl() {
        return randomGravatar();
    },
    infoUrl() {
        return faker.internet.url();
    },
    active: true,
    isAcceptingTypeOne: true,
    isAcceptingTypeTwo: true,
    fieldNames() {
        return {
            add_submission: 'poster or talk',
            homepage_link_text: 'Conference homepage',
            mail_attachment: 'Your presentation file (e.g., PowerPoint, PDF, etc.)',
            mail_message_body: 'Presentation abstract (if any)',
            mail_subject: 'Presentation title',
            meeting_title_type: 'Posters & Talks',
            submission1: 'poster',
            submission1_plural: 'posters',
            submission2: 'talk',
            submission2_plural: 'talks',
        };
    },
    afterCreate(meeting) {
        meeting.update('typeOneSubmissionEmail', `${meeting.id}-${meeting.fieldNames.submission1}@osf.io`);
        meeting.update('typeTwoSubmissionEmail', `${meeting.id}-${meeting.fieldNames.submission2}@osf.io`);
    },
});

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        meetings: Meeting;
    } // eslint-disable-line semi
}
