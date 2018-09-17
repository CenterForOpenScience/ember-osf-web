import { Factory, faker } from 'ember-cli-mirage';
import File from 'ember-osf-web/models/file';

import { guid } from './utils';

export default Factory.extend<File>({
    id(i: number) {
        return guid(i, 'file');
    },
    name() {
        return faker.system.commonFileName(faker.system.commonFileExt(), faker.system.commonFileType());
    },
    extra: {
        hashes: {
            md5: `${faker.random.uuid().replace(/-/g, '')}`,
            sha256: `${faker.random.uuid().replace(/-/g, '')}`,
        },
        downloads: faker.random.number(1000),
    },
    // kind: 'file',
    // currentUserCanComment: true,
    lastTouched() {
        return faker.date.past(5);
    },
    materializedPath(): string {
        return `/${faker.system.commonFileName(faker.system.commonFileExt(), faker.system.commonFileType())}`;
    },
    dateModified() {
        return faker.date.recent();
    },
    dateCreated() {
        return faker.date.past(5);
    },
    guid(i: number) {
        return guid(i, 'file');
    },
    currentVersion() {
        return faker.random.number(200);
    },
    provider: 'osfstorage',
    path(i: number) {
        return `/${i}`;
    },
    checkout: 'null',
    tags() {
        return faker.lorem.words(5).split(' ');
    },
    size() {
        return faker.random.number(1000000000);
    },
});
