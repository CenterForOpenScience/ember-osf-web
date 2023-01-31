import { Factory, ID, ModelInstance, Server, trait, Trait } from 'ember-cli-mirage';
import faker from 'faker';

import File from 'ember-osf-web/models/file';
import { FileReference } from 'ember-osf-web/packages/registration-schema';

import { guid } from './utils';

export interface FileTraits {
    asFolder: Trait;
}

export interface PolymorphicTargetRelationship {
    id: ID;
    type: 'draft-nodes' | 'nodes';
}

export interface MirageFile extends File {
    fileReference: FileReference;
    targetId: PolymorphicTargetRelationship;
}

export default Factory.extend<MirageFile & FileTraits>({
    id: guid('file'),
    afterCreate: (newObj: ModelInstance, server: Server) => {
        server.create('guid', {
            id: newObj.id,
            referentType: newObj.modelName,
        });
        newObj.update({
            guid: newObj.id,
        });
    },

    name() {
        return faker.system.commonFileName(faker.system.commonFileExt());
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
        return `/${faker.system.commonFileName(faker.system.commonFileExt())}`;
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
    checkout: null,
    tags() {
        return faker.lorem.words(5).split(' ');
    },
    size() {
        return faker.random.number(1000000000);
    },
    kind: 'file',

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
