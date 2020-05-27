import { association, Factory, faker, trait, Trait } from 'ember-cli-mirage';
import File from 'ember-osf-web/models/file';
import { FileReference } from 'ember-osf-web/packages/registration-schema';

import { guid, guidAfterCreate } from './utils';

export interface FileTraits {
    asFolder: Trait;
}

export interface MirageFile extends File {
    fileReference: FileReference;
}

export default Factory.extend<MirageFile & FileTraits>({
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
    target: association() as File['target'],

    asFolder: trait<File>({
        afterCreate(file) {
            const name = file.name.split('.')[0];
            const { parentFolder } = file;
            const materializedPath = parentFolder ? `${parentFolder.materializedPath}${name}/` : `/${name}/`;

            file.update({
                name,
                materializedPath,
                kind: 'folder',
            });
        },
    }),
    fileReference() {
        return {
            file_id: this.id as string,
            file_name: this.name as string,
            file_urls: {
                html: `fakedomain/${this.id}`,
                download: `fakedomain/${this.id}/download`,
            },
            file_hashes: {
                sha256: this.extra.hashes.sha256,
            },
        };
    },
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        file: MirageFile;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        files: File;
    } // eslint-disable-line semi
}
