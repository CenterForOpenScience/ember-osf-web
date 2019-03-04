import { Factory, faker } from 'ember-cli-mirage';
import File from 'ember-osf-web/models/file';

import { guid, guidAfterCreate } from './utils';

export default Factory.extend<File>({
    id: guid('file'),
    guid: guid('file'),
    afterCreate: guidAfterCreate,

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
        return faker.date.past(2, new Date(2018, 0, 0));
    },
    materializedPath(): string {
        return `/${faker.system.commonFileName(faker.system.commonFileExt(), faker.system.commonFileType())}`;
    },
    dateModified() {
        return faker.date.past(2, new Date(2018, 0, 0));
    },
    dateCreated() {
        return faker.date.past(1, new Date(2016, 0, 0));
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

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        files: File;
    } // eslint-disable-line semi
}
