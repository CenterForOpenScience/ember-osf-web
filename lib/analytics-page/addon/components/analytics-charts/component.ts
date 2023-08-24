import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { TaskInstance } from 'ember-concurrency';
import Intl from 'ember-intl/services/intl';
import moment, { Duration } from 'moment';
import Media from 'ember-responsive';

import { Timespan } from 'analytics-page/application/route';

type ChartKey = 'unique_visits' | 'time_of_day' | 'referer_domain' | 'popular_pages';

type ChartsData = Record<ChartKey, unknown>;

export interface ChartSpec {
    chartKey: ChartKey;
    titleKey: string; // intl translation key
    c3ChartConfig: unknown;
}

function excludeNonIntegers(d: any) {
    return parseInt(d, 10) === d ? d : null;
}

interface UniqueVisitsDatum {
    date: string;
    count: number;
}

interface TimeOfDayDatum {
    hour: number;
    count: number;
}

interface RefererDomainDatum {
    referer_domain: number;
    count: number;
}

interface PopularPageDatum {
    path: string;
    route: string;
    title: string;
    count: number;
}

interface PopularPageDisplay {
    name: string;
    count: number;
}

const COLOR_PATTERN = [
    '#00bbde', '#fe6672', '#eeb058', '#8a8ad6', '#ff855c', '#00cfbb',
    '#5a9eed', '#73d483', '#c879bb', '#0099b6', '#d74d58', '#cb9141',
    '#6b6bb6', '#d86945', '#00aa99', '#4281c9', '#57b566', '#ac5c9e',
    '#27cceb', '#ff818b', '#f6bf71', '#9b9be1', '#ff9b79', '#26dfcd',
    '#73aff4', '#87e096', '#d88bcb',
];

const SUBPATH_INTL_KEYS = {
    files: 'analytics.popularPageNames.files',
    analytics: 'analytics.popularPageNames.analytics',
    forks: 'analytics.popularPageNames.forks',
    registrations: 'analytics.popularPageNames.registrations',
    wiki: 'analytics.popularPageNames.wiki',
    metadata: 'analytics.popularPageNames.metadata',
    comments: 'analytics.popularPageNames.comments',
    components: 'analytics.popularPageNames.components',
    links: 'analytics.popularPageNames.links',
    resources: 'analytics.popularPageNames.resources',
};

interface AnalyticsChartArgs {
    nodeId: string;
    timespan: Timespan;
    chartsDataTaskInstance: TaskInstance<ChartsData>;
    chartsEnabled: boolean;
}

export default class AnalyticsChart extends Component<AnalyticsChartArgs> {
    @service media!: Media;
    @service intl!: Intl;

    get shouldUseFakeData(): boolean {
        return !this.args.chartsEnabled || this.args.chartsDataTaskInstance.isRunning;
    }

    get chartSpecs(): ChartSpec[] {
        return [
            this.uniqueVisitsChartSpec,
            this.timeOfDayChartSpec,
            this.refererDomainChartSpec,
            this.popularPagesChartSpec,
        ];
    }

    get timespanDuration(): Duration {
        const { timespan } = this.args;
        if (timespan === 'fortnight') {
            return moment.duration(2, 'week');
        }
        return moment.duration(1, timespan);
    }

    get uniqueVisitsChartSpec(): ChartSpec {
        const data: UniqueVisitsDatum[] = this.shouldUseFakeData ?
            this.fakeUniqueVisitsData :
            this.args.chartsDataTaskInstance.value!.unique_visits as any;
        // Fill in the missing days
        const dataMap = data.reduce(
            (acc, datum) => {
                acc[datum.date] = datum.count;
                return acc;
            },
            {} as Record<string, number>,
        );
        const filledData = [];
        const lastDate = moment().startOf('day');
        const datumDate = moment().subtract(this.timespanDuration).startOf('day');
        while (datumDate.isSameOrBefore(lastDate)) {
            const date = datumDate.format('YYYY-MM-DD');
            const count = dataMap[date] ?? 0;
            filledData.push({ date, count });
            datumDate.add(1, 'day');
        }
        return {
            chartKey: 'unique_visits',
            titleKey: 'analytics.uniqueVisits',
            c3ChartConfig: {
                data: {
                    json: filledData,
                    type: 'line',
                    keys: {
                        x: 'date',
                        value: ['count'],
                    },
                },
                point: {
                    sensitivity: 15,
                },
                tooltip: {
                    format: {
                        title: (x: Date) => x.toDateString(),
                        name: () => this.intl.t('analytics.visits'),
                    },
                },
                legend: {
                    show: false,
                },
                axis: {
                    x: {
                        type: 'timeseries',
                        tick: {
                            format: '%b %d',
                        },
                    },
                    y: {
                        tick: {
                            format: excludeNonIntegers,
                        },
                    },
                },
            },
        };
    }

    get fakeUniqueVisitsData() {
        const data = [];
        for (let i = 10; i; i--) {
            data.push({
                count: Math.floor(Math.random() * 1000),
                date: moment().subtract(i, 'days').format(),
            });
        }
        return data;
    }

    get timeOfDayChartSpec(): ChartSpec {
        const data: TimeOfDayDatum[] = this.shouldUseFakeData ?
            this.fakeTimeOfDayData :
            this.args.chartsDataTaskInstance.value!.time_of_day as any;
        // Fill in the missing hours
        const dataMap = data.reduce(
            (acc, datum) => {
                acc[datum.hour] = datum.count;
                return acc;
            },
            {} as Record<number, number>,
        );
        const filledData = [...Array(24).keys()].map(
            (k: number) => ({
                hour: k,
                count: dataMap[k] ?? 0,
            }),
        );
        return {
            chartKey: 'time_of_day',
            titleKey: 'analytics.visitTimes',
            c3ChartConfig: {
                data: {
                    json: filledData,
                    type: 'bar',
                    keys: {
                        x: 'hour',
                        value: ['count'],
                    },
                },
                color: {
                    pattern: COLOR_PATTERN,
                },
                tooltip: {
                    format: {
                        name: () => this.intl.t('analytics.visits'),
                    },
                },
                legend: {
                    show: false,
                },
                bar: {
                    width: 10,
                },
                axis: {
                    x: {
                        label: {
                            text: this.intl.t('analytics.hourOfDay'),
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
            },
        };
    }

    get fakeTimeOfDayData() {
        const data = [...Array(24).keys()].map(
            (k: number) => ({
                result: Math.floor(Math.random() * 1000),
                x: k,
            }),
        );
        return data;
    }

    get refererDomainChartSpec(): ChartSpec {
        const data: RefererDomainDatum[] = this.shouldUseFakeData ?
            this.fakeRefererDomainData :
            this.args.chartsDataTaskInstance.value!.referer_domain as any;
        const tidyData = data.map(datum => [
            datum.referer_domain ?? this.intl.t('analytics.directLink'),
            datum.count,
        ]);
        return {
            chartKey: 'referer_domain',
            titleKey: 'analytics.topReferrers',
            c3ChartConfig: {
                data: {
                    columns: tidyData,
                    type: 'pie',
                    keys: {
                        value: ['referer_domain', 'count'],
                    },
                },
                color: {
                    pattern: COLOR_PATTERN,
                },
                legend: {
                    show: true,
                    position: 'right',
                },
            },
        };
    }

    get fakeRefererDomainData() {
        const data = [];
        for (let i = 5; i; i--) {
            data.push({
                referer_domain: ' '.repeat(i),
                count: Math.floor(Math.random() * 1000),
            });
        }
        return data.sortBy('count').reverse();
    }

    get popularPagesChartSpec(): ChartSpec {
        let tidyData: PopularPageDisplay[];
        if (this.shouldUseFakeData) {
            tidyData = this.fakePopularPageData;
        } else {
            const data: PopularPageDatum[] = this.args.chartsDataTaskInstance.value!.popular_pages as any;
            const aggregatedResults: { [name: string]: PopularPageDisplay } = {};
            data.forEach(datum => {
                const displayDatum = this.popularPageDisplay(datum);
                const priorDisplay = aggregatedResults[displayDatum.name];
                if (priorDisplay) {
                    priorDisplay.count += displayDatum.count;
                } else {
                    aggregatedResults[displayDatum.name] = displayDatum;
                }
            });
            tidyData = Object.values(aggregatedResults).sortBy('count').reverse().slice(0, 10);
        }
        return {
            chartKey: 'popular_pages',
            titleKey: 'analytics.popularPages',
            c3ChartConfig: {
                data: {
                    json: tidyData,
                    type: 'bar',
                    keys: {
                        x: 'name',
                        value: ['count'],
                    },
                },
                color: {
                    pattern: COLOR_PATTERN,
                },
                tooltip: {
                    format: {
                        name: () => this.intl.t('analytics.visits'),
                    },
                },
                legend: {
                    show: false,
                },
                axis: {
                    rotated: true,
                    x: {
                        type: 'category',
                        tick: {
                            multilineMax: 3,
                        },
                    },
                    y: {
                        tick: {
                            format: excludeNonIntegers,
                        },
                    },
                },
            },
        };
    }

    get fakePopularPageData(): PopularPageDisplay[] {
        const data = [];
        for (let i = 10; i; i--) {
            data.push({
                count: Math.floor(Math.random() * 1000),
                name: ' '.repeat(i),
            });
        }
        return data.sortBy('result').reverse();
    }

    popularPageDisplay(datum: PopularPageDatum): PopularPageDisplay {
        const [, guid, subPath] = datum.path.split('/');
        const pageDisplay: PopularPageDisplay = {
            name: this.popularPageName(subPath),
            count: datum.count,
        };
        if (guid !== this.args.nodeId) {
            pageDisplay.name = `${guid}: ${pageDisplay.name}`;
        }
        return pageDisplay;
    }

    popularPageName(subPath: string) {
        if (subPath && subPath.length) {
            const intlKey = SUBPATH_INTL_KEYS[subPath as keyof typeof SUBPATH_INTL_KEYS];
            return intlKey ? this.intl.t(intlKey) : subPath;
        }
        return this.intl.t('general.home');
    }

    get isMobile() {
        return this.media.isMobile;
    }
}
