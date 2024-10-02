import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { ChartData, ChartOptions, Shape } from 'ember-cli-chart';
import Intl from 'ember-intl/services/intl';
import InstitutionDepartmentsModel from 'ember-osf-web/models/institution-department';

export default class DoughnutKpi extends Component {
    @service intl!: Intl;

    @tracked collapsed = true;
    topDepartments!: InstitutionDepartmentsModel[];
    totalUsers!: number;

    chartHoverIndex = 0;

    get chartOptions(): ChartOptions {
        return {
            aspectRatio: 1,
            legend: {
                display: false,
            },
            onHover: this.onChartHover,
        };
    }

    @action
    onChartHover(_: MouseEvent, shapes: Shape[]) {
        if (shapes.length === 0 || this.chartHoverIndex === shapes[0]._index) {
            return;
        }
        this.set('chartHoverIndex', shapes[0]._index);
    }

    @computed('topDepartments', 'totalUsers')
    get displayDepartments() {
        const departments = this.topDepartments.map(({ name, numberOfUsers }) => ({ name, numberOfUsers }));
        const departmentNumbers = this.topDepartments.map(x => x.numberOfUsers);
        const otherDepartmentNumber = this.totalUsers - departmentNumbers.reduce((a, b) => a + b);

        return [...departments, { name: this.intl.t('general.other'), numberOfUsers: otherDepartmentNumber }];
    }

    @computed('chartHoverIndex', 'displayDepartments.[]')
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

        const backgroundColors = [
            '#00D1FF',
            '#009CEF',
            '#0063EF',
            '#00568D',
            '#004673',
            '#00375A',
            '#263947',
        ];

        const displayDepartmentNames = ['a', 'b', 'c'];
        const displayDepartmentNumbers = [1, 2, 3];

        return {
            labels: displayDepartmentNames,
            datasets: [{
                data: displayDepartmentNumbers,
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
    toggleFacet() {
        this.collapsed = !this.collapsed;
    }
}
