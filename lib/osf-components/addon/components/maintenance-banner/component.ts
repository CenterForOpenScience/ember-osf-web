import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import Cookies from 'ember-cookies/services/cookies';
import { localClassNames } from 'ember-css-modules';
import config from 'ember-get-config';
import moment from 'moment';

import { layout } from 'ember-osf-web/decorators/component';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';

import styles from './styles';
import template from './template';

interface MaintenanceData {
    level?: number;
    message?: string;
    start?: string;
    end?: string;
}

const {
    OSF: {
        cookieDomain,
        cookies: {
            maintenance: maintenanceCookie,
        },
    },
} = config;

@layout(template, styles)
@localClassNames('MaintenanceBanner')
export default class MaintenanceBanner extends Component.extend({
    getMaintenanceStatus: task(function *(this: MaintenanceBanner): IterableIterator<any> {
        const url: string = `${config.OSF.apiUrl}/v2/status/`;
        const data = yield this.currentUser.authenticatedAJAX({ url });
        this.set('maintenance', data.maintenance);
    }).restartable(),
}) {
    @service analytics!: Analytics;
    @service cookies!: Cookies;
    @service currentUser!: CurrentUser;

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
        if (!this.cookies.exists(maintenanceCookie)) {
            this.get('getMaintenanceStatus').perform();
        }
    }

    @action
    dismiss(this: MaintenanceBanner) {
        this.analytics.click('button', 'Maintenance Banner - dismiss');
        this.cookies.write(maintenanceCookie, 0, {
            expires: moment().add(24, 'hours').toDate(),
            path: '/',
            domain: cookieDomain,
        });
        this.set('maintenance', null);
    }
}
