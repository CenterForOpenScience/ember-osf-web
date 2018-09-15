import { Factory, faker } from 'ember-cli-mirage';
import config from 'ember-get-config';

import { guid } from './utils';

const { OSF: { apiUrl } } = config;

export default Factory.extend({
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
    kind: 'file',
    last_touched() {
        return faker.date.past(5);
    },
    materialized_path: `/${faker.system.commonFileName(faker.system.commonFileExt(), faker.system.commonFileType())}`,
    date_modified() {
        return faker.date.recent();
    },
    date_created() {
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
    currentUserCanComment: true,
    checkout: null,
    tags() {
        return faker.lorem.words(5).split(' ');
    },
    size() {
        return faker.random.number(1000000000);
    },
    normalLinks(i: number) {
        const id = guid(i, 'file');
        return {
            upload: `${apiUrl}/wb/files/${id}/upload/`,
            download: `${apiUrl}/wb/files/${id}/download/`,
            move: `${apiUrl}/wb/files/${id}/move/`,
            delete: `${apiUrl}/wb/files/${id}/download/`,
            self: `${apiUrl}/v2/files/${id}/`,
            info: `${apiUrl}/v2/files/${id}/`,
        };
    },
});
