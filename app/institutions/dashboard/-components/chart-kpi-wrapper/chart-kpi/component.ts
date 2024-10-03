import Component from '@glimmer/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { ChartData, ChartOptions } from 'ember-cli-chart';
import Intl from 'ember-intl/services/intl';
import InstitutionDepartmentsModel from 'ember-osf-web/models/institution-department';

interface KPIChartWrapperArgs {
    title: string;
    total: number;
    chart: string;
}

interface DataModel {
    name: string;
    total: number;
    color: string;
}

export default class ChartKpi extends Component<KPIChartWrapperArgs> {
    @service intl!: Intl;

    @tracked expanded = false;
    @tracked expandedData = [] as DataModel[];
    topDepartments!: InstitutionDepartmentsModel[];
    totalUsers!: number;

    chartHoverIndex = 0;

    /**
     * chartOptions
     *
     * @description A getter for the chartjs options
     *
     * @returns a ChartOptions model which is custom to COS
     */
    get chartOptions(): ChartOptions{
        return {
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
                }],
            },
        };
    }

    @computed('topDepartments', 'totalUsers')
    get displayDepartments() {
        const departments = this.topDepartments.map(({ name, numberOfUsers }) => ({ name, numberOfUsers }));
        const departmentNumbers = this.topDepartments.map(x => x.numberOfUsers);
        const otherDepartmentNumber = this.totalUsers - departmentNumbers.reduce((a, b) => a + b);

        return [...departments, { name: this.intl.t('general.other'), numberOfUsers: otherDepartmentNumber }];
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

    @computed('chartHoverIndex', 'displayDepartments.[]', 'expandedData.[]')
    get chartData(): ChartData {
        /*
        const backgroundColors = this.displayDepartments.map((_, i) => {
            if (i === this.chartHoverIndex) {
                return '#15a5eb';
            }
            return '#a5b3bd';
        });

        const displayDepartmentNames = this.displayDepartments.map(({ name }) => name);
        const displayDepartmentNumbers = this.displayDepartments.map(({ numberOfUsers }) => numberOfUsers);
        */

        const backgroundColors = [] as string[];

        const displayDepartmentNames = ['a very long data set title that needs to be handled', 'b', 'c',
            'd', 'e', 'brian', 'g', 'repeated color'];
        const displayDepartmentNumbers = [100000, 50000,
            25000,
            10000,
            5000,
            500,
            50,
            5,
        ];

        displayDepartmentNames.map((departmentName: string, $index: number) => {
            backgroundColors.push(this.getColor($index));

            this.expandedData.push({
                name: departmentName ,
                total: displayDepartmentNumbers[$index],
                color: this.getColor($index),
            });
        });

        return {
            // labels: displayDepartmentNames,
            labels: ['a',
                'b',
                'b',
                'b',
                'b',
                'b',
                'b',
                'b',
                'b',

            ],
            datasets: [{
                data: displayDepartmentNumbers,
                fill: false,
                backgroundColor: backgroundColors,
            }],
        };
    }

    /*
    @computed('chartHoverIndex', 'displayDepartments.[]')
    get activeDepartment(): Department {
        return this.displayDepartments[this.chartHoverIndex];
    }

    @computed('activeDepartment.numberOfUsers', 'displayDepartments')
    get activeDepartmentPercentage(): string {
        const numUsersArray = this.displayDepartments.map(({ numberOfUsers }) => numberOfUsers);
        const count = numUsersArray.reduce((a, b) => a + b);
        return ((this.activeDepartment.numberOfUsers / count) * 100).toFixed(2);
    }
    */


    @action
    public toggleExpandedData() {
        this.expanded = !this.expanded;
    }
}
