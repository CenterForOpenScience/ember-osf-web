import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import config from 'ember-get-config';
import Analytics from 'ember-osf-web/services/analytics';
import $ from 'jquery';
import moment from 'moment';

interface MaintenanceData {
    level?: number;
    message?: string;
    start?: string;
    end?: string;
}

export default class MaintenanceBanner extends Component.extend({
    getMaintenanceStatus: task(function *(this: MaintenanceBanner): IterableIterator<any> {
        const url: string = `${config.OSF.apiUrl}/v2/status/`;
        const data = yield $.ajax(url, { type: 'GET' });
        this.set('maintenance', data.maintenance);
    }).restartable(),
}) {
    @service analytics!: Analytics;

    maintenance?: MaintenanceData | null;

    @computed('maintenance.start')
    get start(): string | undefined {
        return this.maintenance && this.maintenance.start ? moment(this.maintenance.start).format('lll') : undefined;
    }

    @computed('maintenance.end')
    get end(): string | undefined {
        return this.maintenance && this.maintenance.end ? moment(this.maintenance.end).format('lll') : undefined;
    }

    @computed('maintenance.start')
    get utc(): string | undefined {
        return this.maintenance && this.maintenance.start ? moment(this.maintenance.start).format('ZZ') : undefined;
    }

    @computed('maintenance.level')
    get alertType(): string | undefined {
        const levelMap = ['info', 'warning', 'danger'];
        return this.maintenance && this.maintenance.level ? levelMap[this.maintenance.level - 1] : undefined;
    }

    didReceiveAttrs(this: MaintenanceBanner): void {
        this.get('getMaintenanceStatus').perform();
    }
}
