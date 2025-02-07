import { Factory, trait, Trait } from 'ember-cli-mirage';
import LogModel from 'ember-osf-web/models/log';

import { guidAfterCreate } from './utils';

export interface LogsTraits {
    license: Trait;
    tag: Trait;
    fileAdded: Trait;
}

export default Factory.extend<LogModel & LogsTraits>({
    id: 'unknown',
    action: 'unknown',
    date: new Date('2025-02-06T19:51:35.017269Z'),
    params: Object({
        contributors: [],
        paramsNode: {
            id: 'c2het',
            title: 'A new project for testing file components',
        },
        paramsProject: null,
        path: '/hat.jpg',
        pointer: null,
        preprintProvider: null,
        urls: {
            view: '/c2het/files/osfstorage/6786c8874fde462e7f1ec489/?pid=c2het',
            download: '/c2het/files/osfstorage/6786c8874fde462e7f1ec489/?pid=c2het?action=download',
        },
    }),


    afterCreate(log, server) {
        guidAfterCreate(log, server);

        const user = server.create('user', {
            givenName: 'Futa',
            familyName: 'Geiger',
        });

        log.update({
            user,
        });
    },

    license: trait<LogModel>({
        afterCreate(log) {
            const params = log.params;
            params.license = 'Apache License 2.0';
            log.update({
                params,
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
        log: LogModel;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        log: LogModel;
    } // eslint-disable-line semi
}
