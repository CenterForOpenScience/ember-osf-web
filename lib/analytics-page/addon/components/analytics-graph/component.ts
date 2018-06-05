import Component from '@ember/component';
import { task } from 'ember-concurrency';
import config from 'ember-get-config';
import KeenAnalysis from 'keen-analysis';
import KeenDataviz from 'keen-dataviz';
import moment from 'moment';

import { localClassNames } from 'ember-osf-web/decorators/css-modules';
import Node from 'ember-osf-web/models/node';
import styles from './styles';
import layout from './template';

const {
    OSF: {
        keenProjectId,
    },
} = config;

@localClassNames('AnalyticsGraph')
export default class AnalyticsGraph extends Component {
    layout = layout;
    styles = styles;

    node!: Node;

    loadKeen = task(function *(this: AnalyticsGraph) {
        if (!this.node.analyticsKey) {
            throw Error('No analytics key');
        }
        const keenClient = new KeenAnalysis({
            projectId: keenProjectId,
            readKey: this.node.analyticsKey,
        });

        const chart = new KeenDataviz()
            .el('#chart')
            .colors(['red', 'orange', 'green'])
            .title('Unique visits')
            .type('line')
            .dateFormat('%b %d')
            .prepare();

        const result = yield keenClient.query('count_unique', {
            timeframe: {
                start: moment().subtract(1, 'days').format(),
                end: moment().format(),
            },
            event_collection: 'page_views',
            interval: 'daily',
            target_property: 'anon.id',
        });

        chart.data(result).render();
    });

    didInsertElement(this: AnalyticsGraph, ...args: any[]) {
        this._super(...args);
        this.get('loadKeen').perform();
    }
}
