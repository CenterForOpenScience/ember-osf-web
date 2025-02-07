import { Factory, trait, Trait } from 'ember-cli-mirage';
import faker from 'faker';
import LogModel from 'ember-osf-web/models/log';

import { guid, guidAfterCreate } from './utils';

export interface LogsTraits {
    license: Trait;
    tag: Trait;
    fileAdded: Trait;
}

export default Factory.extend<LogModel & LogsTraits>({
    id: guid('log'),
    afterCreate: guidAfterCreate,
    action: faker.lorem.sentence(),
    date: faker.date.past(2, new Date(2019, 0, 0)),
    params: Object({
        contributors: [],
        params_node: {
            id: 'c2het',
            title: 'A new project for testing file components',
        },
        params_project: null,
        path: '/hat.jpg',
        pointer: null,
        preprint_provider: null,
        urls: {
            view: '/c2het/files/osfstorage/6786c8874fde462e7f1ec489/?pid=c2het',
            download: '/c2het/files/osfstorage/6786c8874fde462e7f1ec489/?pid=c2het?action=download',
        },
    }),

    license: trait<LogModel>({
        afterCreate(log) {
            log.update({
                params: {
                    contributors: [],
                    license: 'Apache License 2.0',
                    params_node: {
                        id: 'c2het',
                        title: 'A new project for testing file components',
                    },
                    params_project: null,
                    path: '/hat.jpg',
                    pointer: null,
                    preprint_provider: null,
                    urls: {
                        view: '/c2het/files/osfstorage/6786c8874fde462e7f1ec489/?pid=c2het',
                        download: '/c2het/files/osfstorage/6786c8874fde462e7f1ec489/?pid=c2het?action=download',
                    },
                },
            });
        },
    }),
    tag: trait<LogModel>({
        afterCreate(log) {
            log.update({
                params: {
                    contributors: [],
                    license: 'Apache License 2.0',
                    params_node: {
                        id: 'c2het',
                        title: 'A new project for testing file components',
                    },
                    params_project: null,
                    path: '/hat.jpg',
                    pointer: null,
                    preprint_provider: null,
                    tag: 'Food',
                    urls: {
                        view: '/c2het/files/osfstorage/6786c8874fde462e7f1ec489/?pid=c2het',
                        download: '/c2het/files/osfstorage/6786c8874fde462e7f1ec489/?pid=c2het?action=download',
                    },
                },
            });
        },
    }),
    fileAdded: trait<LogModel>({
        afterCreate(log) {
            log.update({
                params: {
                    contributors: [],
                    license: 'Apache License 2.0',
                    params_node: {
                        id: 'c2het',
                        title: 'A new project for testing file components',
                    },
                    params_project: null,
                    path: '/hat.jpg',
                    pointer: null,
                    preprint_provider: null,
                    tag: 'Food',
                    urls: {
                        view: '/c2het/files/osfstorage/6786c8874fde462e7f1ec489/?pid=c2het',
                        download: '/c2het/files/osfstorage/6786c8874fde462e7f1ec489/?pid=c2het?action=download',
                    },
                },
            });
        },
    }),
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        logs: LogModel;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        logs: LogModel;
    } // eslint-disable-line semi
}
