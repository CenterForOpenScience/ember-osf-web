import Controller from '@ember/controller';
import { not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';
import Media from 'ember-responsive';

import Registration from 'ember-osf-web/models/registration';

export default class BrandedModerationOverviewController extends Controller {
    @service store!: DS.Store;
    @service media!: Media;

    @not('media.isDesktop') showMobileView!: boolean;

    registration?: Registration;

    @task({ withTestWaiter: true })
    loadRegistration = task(function *(this: BrandedModerationOverviewController) {
        const id = this.model.registrationId;
        this.registration = yield this.store.findRecord('registration', id);
    });
}
