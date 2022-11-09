import Modifier from 'ember-modifier';
import bb, { line, subchart } from 'billboard.js';

interface MetricsChartArgs {
    positional: [];
    named: {
        dataColumns?: Array<Array<string|number>>,
        dataRows?: Array<Array<string|number>>,
    };
}

export default class MetricsChart extends Modifier<MetricsChartArgs> {
    chart: any = null;

    didReceiveArguments() {
        if (this.chart) {
            this.chart.destroy();
        }
        this.chart = bb.generate({
            bindto: this.element,
            data: {
                type: line(),
                x: 'report_date',
                // columns: this.args.named.dataColumns,
                rows: this.args.named.dataRows,
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%Y-%m-%d',
                    },
                },
            },
            subchart: {
                show: subchart(),
                showHandle: true,
            },
            tooltip: {
                grouped: false,
                linked: true,
            },
        });
    }

    willRemove() {
        if (this.chart) {
            this.chart.destroy();
        }
    }
}

