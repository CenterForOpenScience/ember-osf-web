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
}

interface LogTraits {
    empty: Trait;
    addFile: Trait;
    identifiersNoArk: Trait;
    identifiersNoDoi: Trait;
    institution: Trait;
    noPage: Trait;
    linkedNode: Trait;
    preprint: Trait;
    templateNode: Trait;
}

export default Factory.extend<MirageLogModel & LogTraits>({
    id: guid('log'),
    action: 'unknown',
    date: new Date('2025-02-06T19:51:35.017269Z'),
    params: Object({
        anonymousLink: true,
        addon: 'The add on',
        contributors: [],
        pageId: 'page-id-1',
        page: 'the page name',
        oldPage: 'the old page name',
        guid: 'the guid',
        institution: null,
        kind: 'the kind',
        license: 'Apache License 2.0',
        paramsNode: {
            id: 'c2het',
            title: 'A new project for testing file components',
        },
        identifiers: {
            doi: 'doi',
            ark: 'ark',
        },
        paramsProject: null,
        path: '/the-folder',
        preprint: null,
        preprintProvider: null,
        tag: 'Food',
        urls: {
            view: '/c2het/files/osfstorage/6786c8874fde462e7f1ec489/?pid=c2het',
            download: '/c2het/files/osfstorage/6786c8874fde462e7f1ec489/?pid=c2het?action=download',
        },
        version: '348',
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

    empty: trait<MirageLogModel>({
        afterCreate(log) {
            log.update({
                user: undefined,
                linkedNode: undefined,
                params: undefined,
            });


            log.save();
        },
    }),

    addFile: trait<MirageLogModel>({
        afterCreate(log) {
            const params = log.params;
            params.path = 'hat.jpg/';
            log.update({ params});
        },
    }),

    identifiersNoArk: trait<MirageLogModel>({
        afterCreate(log) {
            const params = log.params;
            params.identifiers = {
                doi: 'doi',
            };
            log.update({ params});
        },
    }),

    identifiersNoDoi: trait<MirageLogModel>({
        afterCreate(log) {
            const params = log.params;
            params.identifiers = {
                ark: 'ark',
            };
            log.update({ params});
        },
    }),

    institution: trait<MirageLogModel>({
        afterCreate(log) {
            const params = log.params;
            params.institution = {
                name: 'Institution Name',
                id: 'guid',
            };
            log.update({ params});
        },
    }),

    linkedNode: trait<MirageLogModel>({
        afterCreate(log, server) {
            const linkedNode = server.create('node', {
                description: 'This is the node description',
                title: 'The linked node for testing',
                category: NodeCategory.Analysis,
            });

            log.update({
                linkedNode,
            });
        },
    }),

    noPage: trait<MirageLogModel>({
        afterCreate(log) {
            const params = log.params;
            params.page = undefined as any;
            params.oldPage = undefined as any;
            params.pageId = undefined as any;
            params.version = undefined as any;
            log.update({ params});
        },
    }),

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

    templateNode: trait<MirageLogModel>({
        afterCreate(log, server) {
            const templateNode = server.create('node', {
                description: 'This is the template node description',
                title: 'The template node for testing',
                category: NodeCategory.Analysis,
            });

            log.update({
                linkedNode: templateNode,
            });
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
