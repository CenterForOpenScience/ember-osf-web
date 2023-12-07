import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

import FileVersionModel from 'ember-osf-web/models/file-version';

export default Factory.extend<FileVersionModel>({
    id() {
        return faker.random.number(1000);
    },
    size() {
        return faker.random.number(1000);
    },
    contentType: 'application/octet-stream',
    dateCreated() {
        return faker.date.past(2, new Date(2018, 0, 0));
    },
    name() {
        return faker.system.commonFileName(faker.system.commonFileExt());
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
