import Component from '@ember/component';
import { computed } from '@ember/object';
import { not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';
import Media from 'ember-responsive';
import Toast from 'ember-toastr/services/toast';

import ModeratorModel from 'ember-osf-web/models/moderator';
import RegistrationModel from 'ember-osf-web/models/registration';
import CurrentUserService from 'ember-osf-web/services/current-user';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

export default class OverviewHeader extends Component {
    @service media!: Media;
    @service currentUser!: CurrentUserService;
    @service store!: DS.Store;
    @service toast!: Toast;
    @not('media.isDesktop') showMobileView!: boolean;

    registration!: RegistrationModel;
    viewMode!: string;

    @tracked currentModerator?: ModeratorModel;

    @computed('viewMode', 'currentModerator')
    get canViewAsModerator() {
        if (this.viewMode === 'moderator' && Boolean(this.currentModerator)) {
            return true;
        }
        return false;
    }

    @task({ withTestWaiter: true, on: 'init' })
    loadcurrentModerator =
    task(function *(this: OverviewHeader) {
        try {
            if (this.currentUser.currentUserId) {
                this.currentModerator = yield this.store.findRecord('moderator', this.currentUser.currentUserId,
                    {
                        adapterOptions: {
                            providerId: this.registration.provider.get('id'),
                        },
                    });
            }
        } catch (e) {
            captureException(e);
            this.toast.error(getApiErrorMessage(e));
        }
    });
}
