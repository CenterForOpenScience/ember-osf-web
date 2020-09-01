import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';

import ModeratorModel from 'ember-osf-web/models/moderator';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUserService from 'ember-osf-web/services/current-user';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import Toast from 'ember-toastr/services/toast';

export default class BrandedModerationModeratorsController extends Controller {
    @service analytics!: Analytics;
    @service currentUser!: CurrentUserService;
    @service store!: DS.Store;
    @service toast!: Toast;

    @tracked moderators?: ModeratorModel[];

    @task({ withTestWaiter: true })
    loadModerators = task(function *(this: BrandedModerationModeratorsController) {
        try {
            this.moderators = yield this.model.moderators;
        } catch (e) {
            captureException(e);
            this.toast.error(getApiErrorMessage(e));
        }
    });
}
