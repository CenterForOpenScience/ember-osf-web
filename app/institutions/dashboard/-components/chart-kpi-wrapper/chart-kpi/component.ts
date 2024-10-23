import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { ChartData, ChartOptions } from 'ember-cli-chart';
import Intl from 'ember-intl/services/intl';
// eslint-disable-next-line max-len
import { ChartDataModel, KpiChartModel } from 'ember-osf-web/institutions/dashboard/-components/chart-kpi-wrapper/component';

interface KPIChartWrapperArgs {
    data: KpiChartModel;
}

interface DataModel {
    name: string;
    total: number;
    color: string;
}

export default class ChartKpi extends Component<KPIChartWrapperArgs> {
    @service intl!: Intl;

    @tracked collapsed = true;
    @tracked expandedData = [] as DataModel[];

    /**
     * chartOptions
     *
     * @description A getter for the chartjs options
     *
     * @returns a ChartOptions model which is custom to COS
     */
    get chartOptions(): ChartOptions {
        const options = {
            aspectRatio: 1,
            legend: {
                display: false,
            },
            scales: {
                xAxes: [{
                    display: false,
                }],
                yAxes: [{
                    display: false,
                    ticks: { min: 0 },
                }],
            },
        };
        if (this.args.data.chartType === 'bar') {
            options.scales.yAxes[0].display = true;
        }
        return options;
    }

    /**
     * getColor
     *
     * @description Gets a specific color using a modulus
     *
     * @param index The index to retrieve
     *
     * @returns the color
     */
    private getColor(index: number): string {
        const backgroundColors = [
            '#00D1FF',
            '#009CEF',
            '#0063EF',
            '#00568D',
            '#004673',
            '#00375A',
            '#263947',
        ];

        return backgroundColors[index % backgroundColors.length];
    }

    /**
     * chartData
     *
     * @description Transforms the standard chart data into data the charts can display
     *
     * @returns void
     */
    get chartData(): ChartData {
        const backgroundColors = [] as string[];
        const data = [] as number[];
        const labels = [] as string[];
        const { taskInstance, chartData } = this.args.data;

        let rawData = chartData ? chartData : [];
        if (taskInstance) {
            if (taskInstance.value) {
                rawData = taskInstance.value;
            }
        }
        rawData.map((rawChartData: ChartDataModel, $index: number) => {
            backgroundColors.push(this.getColor($index));

            data.push(rawChartData.total);
            labels.push(rawChartData.label);
            this.expandedData.push({
                name: rawChartData.label,
                total: rawChartData.total,
                color: this.getColor($index),
            });
        });
        return {
            labels,
            datasets: [{
                data,
                fill: false,
                backgroundColor: backgroundColors,
            }],
        };
    }

    @action
    public toggleExpandedData() {
        this.collapsed = !this.collapsed;
    }
}
