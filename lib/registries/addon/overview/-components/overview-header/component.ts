import Store from '@ember-data/store';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Intl from 'ember-intl/services/intl';
import Media from 'ember-responsive';
import Toast from 'ember-toastr/services/toast';

import ModeratorModel from 'ember-osf-web/models/moderator';
import RegistrationModel from 'ember-osf-web/models/registration';
import CurrentUserService from 'ember-osf-web/services/current-user';
import captureException from 'ember-osf-web/utils/capture-exception';

export default class OverviewHeader extends Component {
    @service media!: Media;
    @service currentUser!: CurrentUserService;
    @service store!: Store;
    @service intl!: Intl;
    @service toast!: Toast;

    @not('media.isDesktop') showMobileView!: boolean;

    registration!: RegistrationModel;
    mode!: string;

    @tracked currentModerator?: ModeratorModel;

    @computed('registration.{reviewsState,archiving}')
    get showTopbar() {
        return this.registration && !(this.registration.reviewsState === 'withdrawn' || this.registration.archiving);
    }

    @computed('mode', 'currentModerator')
    get canViewAsModerator() {
        if (this.mode === 'moderator' && Boolean(this.currentModerator)) {
            return true;
        }
        return false;
    }

    @task
    @waitFor
    async loadCurrentModerator() {
        try {
            this.currentModerator = await this.store.findRecord('moderator', this.currentUser.currentUserId!,
                {
                    adapterOptions: {
                        providerId: this.registration.provider.get('id'),
                    },
                });
        } catch (e) {
            captureException(e);
            this.toast.error(this.intl.t('registries.overviewHeader.needModeratorPermission'));
        }
    }

    didReceiveAttrs() {
        if (this.mode === 'moderator' && this.currentUser.currentUserId) {
            taskFor(this.loadCurrentModerator).perform();
        }
    }
}
