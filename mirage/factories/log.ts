import { Factory } from 'ember-cli-mirage';
import LogModel from 'ember-osf-web/models/log';

import { guidAfterCreate } from './utils';

export default Factory.extend<LogModel >({
    id: 'unknown',
    action: 'unknown',
    date: new Date('2025-02-06T19:51:35.017269Z'),
    params: Object({
        contributors: [],
        guid: 'the guid',
        paramsNode: {
            id: 'c2het',
            title: 'A new project for testing file components',
        },
        paramsProject: null,
        path: '/hat.jpg',
        tag: 'Food',
        pathType: 'file',
        pointer: null,
        license: 'Apache License 2.0',
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
