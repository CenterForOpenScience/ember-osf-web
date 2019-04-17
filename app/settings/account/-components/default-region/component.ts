import { tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import DS from 'ember-data';
import config from 'ember-get-config';
import I18N from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import RegionModel from 'ember-osf-web/models/region';
import User from 'ember-osf-web/models/user';
import CurrentUser from 'ember-osf-web/services/current-user';

@tagName('')
export default class DefaultRegionPane extends Component.extend({
    loadRegionsTask: task(function *(this: DefaultRegionPane) {
        const regions = yield this.store.findAll('region');

        this.set('regions', regions.toArray());
    }),

    loadDefaultRegionTask: task(function *(this: DefaultRegionPane) {
        const { user } = this.currentUser;
        if (!user) {
            return;
        }

        yield user.belongsTo('defaultRegion').reload();
    }),
}) {
    @service currentUser!: CurrentUser;
    @service i18n!: I18N;
    @service toast!: Toast;
    @service store!: DS.Store;
    @alias('currentUser.user') user!: User;
    regions?: RegionModel[];
    @alias('loadDefaultRegionTask.isRunning') loadDefaultRunning!: boolean;
    @alias('loadRegionsTask.isRunning') loadRegionsRunning!: boolean;

    init() {
        super.init();
        this.loadRegionsTask.perform();
        this.loadDefaultRegionTask.perform();
    }

    @action
    updateRegion() {
        this.toast.success(
            this.i18n.t(
                'settings.account.defaultRegion.successToast',
                {
                    region: this.user.defaultRegion.name,
                },
            ),
        );
    }

    @action
    updateError() {
        this.user.rollbackAttributes();
        const { supportEmail } = config.support;
        const saveErrorMessage = this.i18n.t('settings.account.defaultRegion.saveError', { supportEmail });
        return this.toast.error(saveErrorMessage);
    }

    @action
    destroyForm() {
        this.user.rollbackAttributes();
    }
}
