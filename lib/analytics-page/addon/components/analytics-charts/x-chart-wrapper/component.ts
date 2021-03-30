import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { restartableTask, TaskInstance } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Intl from 'ember-intl/services/intl';
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
    @service intl!: Intl;
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

    @restartableTask
    async loadKeen() {
        this.showOverlay(OverlayReason.Loading);
        const node = await this.nodeTaskInstance;
        try {
            let data = await this.keen.queryNode(
                node,
                this.startDate,
                this.endDate,
                this.chartSpec.keenQueryType,
                this.chartSpec.keenQueryOptions(node),
            );

            if (this.chartSpec.processData) {
                data = this.chartSpec.processData(data, this.intl, node);
            }

            this.hideOverlay();
            this.chart.data(data).render();
        } catch (e) {
            this.showOverlay(OverlayReason.Error);
            throw e;
        }
    }

    didInsertElement() {
        this.chart = new KeenDataviz()
            .el(`#${this.elementId} .${styles.Chart}`)
            .title(' '); // Prevent keen-dataviz from adding a default title

        this.initSkeletonChart();
        if (this.chartEnabled) {
            taskFor(this.loadKeen).perform();
        }
    }

    didUpdateAttrs() {
        if (this.chartEnabled) {
            taskFor(this.loadKeen).perform();
        }
    }

    showOverlay(reason?: OverlayReason) {
        this.set('keenError', (reason === OverlayReason.Error));
        this.set('loading', (reason === OverlayReason.Loading));
        this.set('overlayShown', true);
        this.chart.chartOptions({
            interaction: {
                enabled: false,
            },
        });
    }

    hideOverlay() {
        this.set('overlayShown', false);
        this.clearSkeletonChart();
        this.chart.chartOptions({
            interaction: {
                enabled: true,
            },
        });
    }

    initSkeletonChart() {
        this.chartSpec.configureChart(this.chart, this.intl);
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

    clearSkeletonChart() {
        this.chart.chartOptions({
            data: {},
            pie: {},
            axis: {},
        });
        this.chartSpec.configureChart(this.chart, this.intl);
    }
}
