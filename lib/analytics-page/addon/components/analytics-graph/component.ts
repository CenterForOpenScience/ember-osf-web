import Component from '@ember/component';
// import KeenAnalysis from 'keen-analysis';
import KeenDataviz from 'keen-dataviz';

import { localClassNames } from 'ember-osf-web/decorators/css-modules';
import styles from './styles';
import layout from './template';

const responseBody = {
    result: [
        {
            value: 25,
            timeframe: {
                start: '2018-04-07T14:40:26.000Z',
                end: '2018-04-08T04:00:00.000Z',
            },
        },
        {
            value: 51,
            timeframe: {
                start: '2018-04-08T04:00:00.000Z',
                end: '2018-04-09T04:00:00.000Z',
            },
        },
        {
            value: 81,
            timeframe: {
                start: '2018-04-09T04:00:00.000Z',
                end: '2018-04-10T04:00:00.000Z',
            },
        },
        {
            value: 81,
            timeframe: {
                start: '2018-04-10T04:00:00.000Z',
                end: '2018-04-11T04:00:00.000Z',
            },
        },
        {
            value: 72,
            timeframe: {
                start: '2018-04-11T04:00:00.000Z',
                end: '2018-04-12T04:00:00.000Z',
            },
        },
        {
            value: 60,
            timeframe: {
                start: '2018-04-12T04:00:00.000Z',
                end: '2018-04-13T04:00:00.000Z',
            },
        },
        {
            value: 69,
            timeframe: {
                start: '2018-04-13T04:00:00.000Z',
                end: '2018-04-14T04:00:00.000Z',
            },
        },
        {
            value: 45,
            timeframe: {
                start: '2018-04-14T04:00:00.000Z',
                end: '2018-04-15T04:00:00.000Z',
            },
        },
        {
            value: 55,
            timeframe: {
                start: '2018-04-15T04:00:00.000Z',
                end: '2018-04-16T04:00:00.000Z',
            },
        },
        {
            value: 77,
            timeframe: {
                start: '2018-04-16T04:00:00.000Z',
                end: '2018-04-17T04:00:00.000Z',
            },
        },
        {
            value: 86,
            timeframe: {
                start: '2018-04-17T04:00:00.000Z',
                end: '2018-04-18T04:00:00.000Z',
            },
        },
        {
            value: 66,
            timeframe: {
                start: '2018-04-18T04:00:00.000Z',
                end: '2018-04-19T04:00:00.000Z',
            },
        },
        {
            value: 72,
            timeframe: {
                start: '2018-04-19T04:00:00.000Z',
                end: '2018-04-20T04:00:00.000Z',
            },
        },
        {
            value: 73,
            timeframe: {
                start: '2018-04-20T04:00:00.000Z',
                end: '2018-04-21T04:00:00.000Z',
            },
        },
        {
            value: 59,
            timeframe: {
                start: '2018-04-21T04:00:00.000Z',
                end: '2018-04-22T04:00:00.000Z',
            },
        },
        {
            value: 59,
            timeframe: {
                start: '2018-04-22T04:00:00.000Z',
                end: '2018-04-23T04:00:00.000Z',
            },
        },
        {
            value: 75,
            timeframe: {
                start: '2018-04-23T04:00:00.000Z',
                end: '2018-04-24T04:00:00.000Z',
            },
        },
        {
            value: 97,
            timeframe: {
                start: '2018-04-24T04:00:00.000Z',
                end: '2018-04-25T04:00:00.000Z',
            },
        },
        {
            value: 96,
            timeframe: {
                start: '2018-04-25T04:00:00.000Z',
                end: '2018-04-26T04:00:00.000Z',
            },
        },
        {
            value: 64,
            timeframe: {
                start: '2018-04-26T04:00:00.000Z',
                end: '2018-04-27T04:00:00.000Z',
            },
        },
        {
            value: 72,
            timeframe: {
                start: '2018-04-27T04:00:00.000Z',
                end: '2018-04-28T04:00:00.000Z',
            },
        },
        {
            value: 37,
            timeframe: {
                start: '2018-04-28T04:00:00.000Z',
                end: '2018-04-29T04:00:00.000Z',
            },
        },
        {
            value: 60,
            timeframe: {
                start: '2018-04-29T04:00:00.000Z',
                end: '2018-04-30T04:00:00.000Z',
            },
        },
        {
            value: 70,
            timeframe: {
                start: '2018-04-30T04:00:00.000Z',
                end: '2018-05-01T04:00:00.000Z',
            },
        },
        {
            value: 81,
            timeframe: {
                start: '2018-05-01T04:00:00.000Z',
                end: '2018-05-02T04:00:00.000Z',
            },
        },
        {
            value: 80,
            timeframe: {
                start: '2018-05-02T04:00:00.000Z',
                end: '2018-05-03T04:00:00.000Z',
            },
        },
        {
            value: 73,
            timeframe: {
                start: '2018-05-03T04:00:00.000Z',
                end: '2018-05-04T04:00:00.000Z',
            },
        },
        {
            value: 59,
            timeframe: {
                start: '2018-05-04T04:00:00.000Z',
                end: '2018-05-05T04:00:00.000Z',
            },
        },
        {
            value: 41,
            timeframe: {
                start: '2018-05-05T04:00:00.000Z',
                end: '2018-05-06T04:00:00.000Z',
            },
        },
        {
            value: 49,
            timeframe: {
                start: '2018-05-06T04:00:00.000Z',
                end: '2018-05-07T04:00:00.000Z',
            },
        },
        {
            value: 44,
            timeframe: {
                start: '2018-05-07T04:00:00.000Z',
                end: '2018-05-07T14:40:26.000Z',
            },
        },
    ],
};

@localClassNames('AnalyticsGraph')
export default class AnalyticsGraph extends Component {
    layout = layout;
    styles = styles;

    didInsertElement(...args: any[]) {
        this._super(...args);

        const chart = new KeenDataviz()
            .el('#chart')
            .colors(['red', 'orange', 'green'])
            .title('Unique visits')
            .type('line')
            .dateFormat('%b %d')
            .prepare();

        chart.data(responseBody).render();
    }
}
