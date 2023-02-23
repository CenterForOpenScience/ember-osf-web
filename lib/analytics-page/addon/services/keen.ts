import Service from '@ember/service';
import config from 'ember-get-config';
import KeenAnalysis from 'keen-analysis';
import { Moment } from 'moment';

import Node from 'ember-osf-web/models/node';

const { keen: metricsAdapters } = config as any;

export default class KeenService extends Service {
    async queryNode(
        node: Node,
        startDate: Moment,
        endDate: Moment,
        keenQueryType: string,
        keenQueryOptions: any,
    ) {
        if (!node.analyticsKey) {
            throw Error('No analytics key on this node');
        }
        const keenConfig = metricsAdapters.findBy('name', 'Keen');
        if (!keenConfig || !keenConfig.config || !keenConfig.config.public || !keenConfig.config.public.projectId) {
            throw Error('Keen adapter not configured');
        }
        const keenClient = new KeenAnalysis({
            projectId: keenConfig.config.public.projectId,
            readKey: node.analyticsKey,
        });

        const options = {
            timeframe: {
                start: startDate.format(),
                end: endDate.format(),
            },
            ...keenQueryOptions,
        };

        return keenClient.query(keenQueryType, options);
    }
}

declare module '@ember/service' {
    interface Registry {
        'keen': KeenService;
    }
}
