import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { task, TaskInstance } from 'ember-concurrency';
import I18n from 'ember-i18n/services/i18n';
import KeenDataviz from 'keen-dataviz';
import { Moment } from 'moment';

import { ChartSpec } from 'analytics-page/components/analytics-charts/component';
import KeenService from 'analytics-page/services/keen';
import Node from 'ember-osf-web/models/node';
import AnalyticsService from 'ember-osf-web/services/analytics';
import styles from './styles';
import layout from './template';

enum OverlayReason {
    Loading,
    Error,
}

export default class ChartWrapper extends Component {
    @service keen!: KeenService;
    @service i18n!: I18n;
    @service analytics!: AnalyticsService;
    layout = layout;
    styles = styles;

    // Required arguments
    chartSpec!: ChartSpec;
    nodeTaskInstance!: TaskInstance<Node>;
    startDate!: Moment;
    endDate!: Moment;
    allowEnablingCharts!: boolean;

    // Private properties
    chart!: KeenDataviz; // set in didInsertElement
    chartEnabled: boolean = false;
    overlayShown: boolean = true;
    loading: boolean = false;
    keenError: boolean = false;

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
    }

    didUpdateAttrs(this: ChartWrapper) {
        if (this.chartEnabled) {
            this.get('loadKeen').perform();
        }
    }

    showOverlay(this: ChartWrapper, reason?: OverlayReason) {
        switch (reason) {
        case OverlayReason.Error:
            this.setProperties({
                loading: false,
                keenError: true,
            });
            break;
        case OverlayReason.Loading:
            this.setProperties({
                loading: true,
                keenError: false,
            });
            break;
        default:
            this.setProperties({
                loading: false,
                keenError: false,
            });
        }
        this.set('overlayShown', true);
        this.chart.chartOptions({
            interaction: {
                enabled: false,
            },
        });
    }

    hideOverlay(this: ChartWrapper) {
        this.set('overlayShown', false);
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

    @action
    enableChart(this: ChartWrapper) {
        // Clear the options from initSkeletonChart
        this.chart.chartOptions({
            data: {},
            pie: {},
            axis: {},
        });
        this.chartSpec.configureChart(this.chart, this.i18n);
        this.set('chartEnabled', true);
        this.get('loadKeen').perform();
        this.analytics.click(
            'button',
            `Analytics - Enable chart - ${this.chartSpec.titleKey}`,
        );
    }
}
