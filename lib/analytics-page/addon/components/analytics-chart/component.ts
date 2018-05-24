import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import I18n from 'ember-i18n/services/i18n';
import KeenDataviz from 'keen-dataviz';
import moment, { Moment } from 'moment';

import Node from 'ember-osf-web/models/node';

import KeenService from 'analytics-page/services/keen';
import layout from './template';

export interface ChartSpec {
    titleKey: string;
    queryType: string;
    queryOptions: any;
    processData?: (data: any, i18n: I18n) => any;
    fakeData?: () => any;
    configureChart(chart: KeenDataviz, i18n: I18n): void;
}

function excludeNonIntegers(d: any) {
    return parseInt(d, 10) === d ? d : null;
}

export default class AnalyticsChart extends Component {
    @service keen!: KeenService;
    @service i18n!: I18n;
    layout = layout;

    // Required arguments
    node!: Node;
    startDate!: Moment;
    endDate!: Moment;

    charts: ChartSpec[] = [
        {
            titleKey: 'analytics.uniqueVisits',
            queryType: 'count_unique',
            queryOptions: {
                event_collection: 'pageviews',
                interval: 'daily',
                target_property: 'anon.id',
            },
            configureChart(chart: KeenDataviz, i18n: I18n) {
                chart.type('line')
                    .dateFormat('%b %d')
                    .chartOptions({
                        point: {
                            sensitivity: 100,
                        },
                        tooltip: {
                            format: {
                                title: (x: Date) => x.toDateString(),
                                name: () => i18n.t('analytics.visits'),
                            },
                        },
                        axis: {
                            y: {
                                tick: {
                                    format: excludeNonIntegers,
                                },
                            },
                        },
                    });
            },
            fakeData() {
                const data = [];
                for (let i = 10; i; i--) {
                    data.push({
                        value: Math.floor(Math.random() * 1000),
                        timeframe: {
                            start: moment().subtract(i, 'days').format(),
                            end: moment().subtract(i - 1, 'days').format(),
                        },
                    });
                }
                return {
                    result: data,
                };
            },
        },
        {
            titleKey: 'analytics.visitTimes',
            queryType: 'count_unique',
            queryOptions: {
                event_collection: 'pageviews',
                target_property: 'anon.id',
                group_by: 'time.local.hour_of_day',
            },
            configureChart(chart: KeenDataviz, i18n: I18n) {
                chart.type('bar')
                    .chartOptions({
                        tooltip: {
                            format: {
                                name: () => i18n.t('analytics.visits'),
                            },
                        },
                        axis: {
                            x: {
                                label: {
                                    text: i18n.t('analytics.hourOfDay'),
                                    position: 'outer-center',
                                },
                                tick: {
                                    centered: true,
                                    multiline: false,
                                    values: [0, 4, 8, 12, 16, 20],
                                },
                            },
                            y: {
                                tick: {
                                    format: excludeNonIntegers,
                                },
                            },
                        },
                    });
            },
            processData(data: any) {
                interface VisitTimeResult {
                    result: number;
                    ['time.local.hour_of_day']: number;
                }

                interface ResultMap {
                    [k: number]: VisitTimeResult;
                }

                // Fill in the missing hours
                const resultMap: ResultMap = {};
                data.result.forEach((r: VisitTimeResult) => {
                    resultMap[r['time.local.hour_of_day']] = r;
                });
                const newResult = [...Array(24).keys()].map(
                    (k: number) => (resultMap[k] || {
                        result: 0,
                        'time.local.hour_of_day': k,
                    }),
                );
                return {
                    ...data,
                    result: newResult,
                };
            },
            fakeData() {
                const data = [...Array(24).keys()].map(
                    (k: number) => ({
                        result: Math.floor(Math.random() * 1000),
                        x: k,
                    }),
                );
                return {
                    result: data,
                };
            },
        },
        {
            titleKey: 'analytics.topReferrers',
            queryType: 'count_unique',
            queryOptions: {
                event_collection: 'pageviews',
                target_property: 'anon.id',
                group_by: 'referrer.info.domain',
                order_by: [{ property_name: 'result', direction: 'DESC' }],
                limit: 10,
            },
            configureChart(chart: KeenDataviz, i18n: I18n) {
                chart.type('pie')
                    .chartOptions({
                        tooltip: {
                            format: {
                                name: () => i18n.t('analytics.visits'),
                            },
                        },
                    });
            },
            processData(data: any, i18n: I18n) {
                for (const result of data.result) {
                    if (result['referrer.info.domain'] === 'null') {
                        result['referrer.info.domain'] = i18n.t('analytics.directLink');
                    }
                }
                return data;
            },
            fakeData() {
                const data = [];
                for (let i = 5; i; i--) {
                    data.push({
                        result: Math.floor(Math.random() * 1000),
                        label: ' '.repeat(i),
                    });
                }
                return {
                    result: data.sortBy('result').reverse(),
                };
            },
        },
        {
            titleKey: 'analytics.popularPages',
            queryType: 'count',
            queryOptions: {
                event_collection: 'pageviews',
                target_property: 'anon.id',
                group_by: ['page.info.path', 'page.title'],
                order_by: [{ property_name: 'result', direction: 'DESC' }],
                limit: 10,
                filters: [{
                    property_name: 'page.info.path',
                    operator: 'not_contains',
                    property_value: '/project/',
                }],
            },
            configureChart(chart: KeenDataviz, i18n: I18n) {
                chart.type('horizontal-bar')
                    .chartOptions({
                        tooltip: {
                            format: {
                                name: () => i18n.t('analytics.visits'),
                            },
                        },
                    });
            },
            processData(data: any) {
                // TODO
                return data;
            },
            fakeData() {
                const data = [];
                for (let i = 10; i; i--) {
                    data.push({
                        result: Math.floor(Math.random() * 1000),
                        label: ' '.repeat(i),
                    });
                }
                return {
                    result: data.sortBy('result').reverse(),
                };
            },
        },
    ];
}
