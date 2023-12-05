import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

import FileVersionModel from 'ember-osf-web/models/file-version';

import { guid } from './utils';

export default Factory.extend<FileVersionModel>({
    id: guid('file - version'),
    afterCreate: (fileVersion/* , server: Server */) => {
        fileVersion.update({
            size: faker.random.number(1000),
            contentType: 'application/octet-stream',
            dateCreated: faker.date.past(2, new Date(2018, 0, 0)),
            name: faker.system.commonFileName(faker.system.commonFileExt()),
        });
    },
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'file-version':  FileVersionModel;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        'file-version': FileVersionModel;
    } // eslint-disable-line semi
}
