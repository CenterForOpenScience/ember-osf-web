import { Factory, trait, Trait } from 'ember-cli-mirage';
import LogModel from 'ember-osf-web/models/log';
import { NodeCategory } from 'ember-osf-web/models/node';

import { guid, guidAfterCreate } from './utils';

export interface MirageLogModel extends LogModel {
    anonymousLink: boolean;
    nodeId: number;
    userId: number;
    linkedNodeId:number;
    originalNodeId: number;
    preprint: string;
}

interface LogTraits {
    preprint: Trait;
}

export default Factory.extend<MirageLogModel & LogTraits>({
    id: guid('log'),
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
        preprint: null,
        license: 'Apache License 2.0',
        preprintProvider: null,
        anonymousLink: true,
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

        const linkedNode = server.create('node', {
            description: 'This is the node description',
            title: 'The linked node for testing',
            category: NodeCategory.Analysis,
        });

        log.update({
            user,
            linkedNode,
        });
    },

    preprint: trait<MirageLogModel>({
        afterCreate(log) {
            const params = log.params;
            params.preprint = '3s8sfsl';
            params.preprintProvider = {
                name: 'Preprint Provider',
                url: 'preprint-provider-url',
            };
            log.update({ params});
        },
    }),
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        log: MirageLogModel;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        log: LogModel;
    } // eslint-disable-line semi
}
