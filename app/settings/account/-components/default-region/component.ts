import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';
import config from 'ember-get-config';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import RegionModel from 'ember-osf-web/models/region';
import User from 'ember-osf-web/models/user';
import CurrentUser from 'ember-osf-web/services/current-user';

@tagName('')
export default class DefaultRegionPane extends Component {
    @service currentUser!: CurrentUser;
    @service intl!: Intl;
    @service toast!: Toast;
    @service store!: DS.Store;
    @alias('currentUser.user') user!: User;
    regions?: RegionModel[];
    @alias('loadDefaultRegionTask.isRunning') loadDefaultRunning!: boolean;
    @alias('loadRegionsTask.isRunning') loadRegionsRunning!: boolean;

    @task({ withTestWaiter: true })
    loadRegionsTask = task(function *(this: DefaultRegionPane) {
        const regions = yield this.store.findAll('region');

        this.set('regions', regions.toArray());
    });

    @task({ withTestWaiter: true })
    loadDefaultRegionTask = task(function *(this: DefaultRegionPane) {
        const { user } = this.currentUser;
        if (!user) {
            return;
        }

        yield user.belongsTo('defaultRegion').reload();
    });

    init() {
        super.init();
        this.loadRegionsTask.perform();
        this.loadDefaultRegionTask.perform();
    }

    @action
    updateRegion() {
        this.toast.success(
            this.intl.t(
                'settings.account.defaultRegion.successToast',
                {
                    region: this.user.defaultRegion.name,
                    htmlSafe: true,
                },
            ),
        );
    }

    @action
    updateError() {
        this.user.rollbackAttributes();
        const { supportEmail } = config.support;
        const saveErrorMessage = this.intl
            .t('settings.account.defaultRegion.saveError', { supportEmail, htmlSafe: true });
        return this.toast.error(saveErrorMessage);
    }

    @action
    destroyForm() {
        this.user.rollbackAttributes();
    }
}
