import Store from '@ember-data/store';
import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { ValidationObject } from 'ember-changeset-validations';
import { validatePresence } from 'ember-changeset-validations/validators';
import { BufferedChangeset } from 'ember-changeset/types';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import config from 'ember-osf-web/config/environment';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import RegionModel from 'ember-osf-web/models/region';
import User from 'ember-osf-web/models/user';
import CurrentUser from 'ember-osf-web/services/current-user';
import buildChangeset from 'ember-osf-web/utils/build-changeset';
import captureException from 'ember-osf-web/utils/capture-exception';

interface RegionValidation {
    defaultRegion: RegionModel;
}

const regionValidation: ValidationObject<RegionValidation> = {
    defaultRegion: [
        validatePresence({
            presence: true,
            allowNone: false,
        }),
    ],
};

@tagName('')
export default class DefaultRegionPane extends Component {
    @service currentUser!: CurrentUser;
    @service intl!: Intl;
    @service toast!: Toast;
    @service store!: Store;
    user?: User;
    regions?: RegionModel[];
    changeset!: BufferedChangeset;
    @alias('loadDefaultRegionTask.isRunning') loadDefaultRunning!: boolean;
    @alias('loadRegionsTask.isRunning') loadRegionsRunning!: boolean;

    @task
    @waitFor
    async loadRegionsTask() {
        const regions = await this.store.findAll('region');

        this.set('regions', regions.toArray());
    }

    @task
    @waitFor
    async loadDefaultRegionTask() {
        const { user } = this.currentUser;
        if (!user) {
            return;
        }
        this.set('user', user);
        this.changeset = buildChangeset(user, regionValidation, { skipValidate: true });
        await user.belongsTo('defaultRegion').reload();
    }

    @task
    @waitFor
    async updateRegion() {
        this.changeset.validate();
        if (this.changeset.isValid && this.user) {
            try {
                await this.changeset.save({});
                this.toast.success(
                    this.intl.t(
                        'settings.account.defaultRegion.successToast',
                        {
                            region: this.user.defaultRegion.name,
                            htmlSafe: true,
                        },
                    ),
                );
            } catch (e) {
                captureException(e);
                const { supportEmail } = config.support;
                const saveErrorMessage = this.intl
                    .t('settings.account.defaultRegion.saveError', { supportEmail, htmlSafe: true });
                this.toast.error(saveErrorMessage);
            }
        }
    }

    init() {
        super.init();
        taskFor(this.loadRegionsTask).perform();
        taskFor(this.loadDefaultRegionTask).perform();
    }
}
