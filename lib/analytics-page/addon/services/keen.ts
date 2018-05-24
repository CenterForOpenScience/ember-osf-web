import Service from '@ember/service';
import config from 'ember-get-config';
import KeenAnalysis from 'keen-analysis';
import { Moment } from 'moment';

import Node from 'ember-osf-web/models/node';

const {
    OSF: {
        keenProjectId,
    },
} = config;

export default class KeenService extends Service {
    async queryNode(
        node: Node,
        startDate: Moment,
        endDate: Moment,
        queryType: string,
        queryOptions: any,
    ) {
        if (!node.analyticsKey) {
            throw Error('No analytics key');
        }
        const keenClient = new KeenAnalysis({
            projectId: keenProjectId,
            readKey: node.analyticsKey,
        });

        const options = {
            timeframe: {
                start: startDate.format(),
                end: endDate.format(),
            },
            ...queryOptions,
        };

        return keenClient.query(queryType, options);
    }
}

declare module '@ember/service' {
    interface Registry {
        'keen': KeenService;
    }
}
