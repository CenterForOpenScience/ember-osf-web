import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { task, TaskInstance } from 'ember-concurrency';
import I18n from 'ember-i18n/services/i18n';
import KeenDataviz from 'keen-dataviz';
import { Moment } from 'moment';

import { layout } from 'ember-osf-web/decorators/component';
import Node from 'ember-osf-web/models/node';
import AnalyticsService from 'ember-osf-web/services/analytics';

import { ChartSpec } from 'analytics-page/components/analytics-charts/component';
import KeenService from 'analytics-page/services/keen';

import styles from './styles';
import template from './template';

enum OverlayReason {
    Error,
    Loading,
}

@layout(template, styles)
export default class ChartWrapper extends Component {
    @service keen!: KeenService;
    @service i18n!: I18n;
    @service analytics!: AnalyticsService;

    // Required arguments
    chartSpec!: ChartSpec;
    chartEnabled!: boolean;
    nodeTaskInstance!: TaskInstance<Node>;
    startDate!: Moment;
    endDate!: Moment;

    // Private properties
    chart!: KeenDataviz; // set in didInsertElement
    overlayShown: boolean = true;
    keenError: boolean = false;
    loading: boolean = false;

    loadKeen = task(function *(this: ChartWrapper) {
        this.showOverlay(OverlayReason.Loading);
        const node = yield this.nodeTaskInstance;
        try {
            let data = yield this.keen.queryNode(
                node,
                this.startDate,
                this.endDate,
                this.chartSpec.keenQueryType,
                this.chartSpec.keenQueryOptions,
            );

            if (this.chartSpec.processData) {
                data = this.chartSpec.processData(data, this.i18n, node);
            }

            this.hideOverlay();
            this.chart.data(data).render();
        } catch (e) {
            this.showOverlay(OverlayReason.Error);
            throw e;
        }
    }).restartable();

    didInsertElement(this: ChartWrapper) {
        this.chart = new KeenDataviz()
            .el(`#${this.elementId} .${styles.Chart}`)
            .title(' '); // Prevent keen-dataviz from adding a default title

        this.initSkeletonChart();
        if (this.chartEnabled) {
            this.get('loadKeen').perform();
        }
    }

    didUpdateAttrs(this: ChartWrapper) {
        if (this.chartEnabled) {
            this.get('loadKeen').perform();
        }
    }

    showOverlay(this: ChartWrapper, reason?: OverlayReason) {
        this.set('keenError', (reason === OverlayReason.Error));
        this.set('loading', (reason === OverlayReason.Loading));
        this.set('overlayShown', true);
        this.chart.chartOptions({
            interaction: {
                enabled: false,
            },
        });
    }

    hideOverlay(this: ChartWrapper) {
        this.set('overlayShown', false);
        this.clearSkeletonChart();
        this.chart.chartOptions({
            interaction: {
                enabled: true,
            },
        });
    }

    initSkeletonChart(this: ChartWrapper) {
        this.chartSpec.configureChart(this.chart, this.i18n);
        this.chart.chartOptions({
            data: {
                labels: false,
            },
            pie: {
                label: {
                    show: false,
                },
            },
            axis: {
                x: {
                    tick: {
                        format: () => '',
                    },
                },
                y: {
                    tick: {
                        format: () => '',
                    },
                },
            },
        });
        if (this.chartSpec.fakeData) {
            this.chart.data(this.chartSpec.fakeData());
        }
        this.showOverlay();
        this.chart.render();
    }

    clearSkeletonChart(this: ChartWrapper) {
        this.chart.chartOptions({
            data: {},
            pie: {},
            axis: {},
        });
        this.chartSpec.configureChart(this.chart, this.i18n);
    }
}
