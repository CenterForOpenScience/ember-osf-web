import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import DS from 'ember-data';
import config from 'ember-get-config';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import CollectionModel from 'ember-osf-web/models/collection';
import RegistrationModel, { RegistrationReviewStates } from 'ember-osf-web/models/registration';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import pathJoin from 'ember-osf-web/utils/path-join';

import styles from './styles';
import template from './template';

const { OSF: { url: baseURL } } = config;

@tagName('')
@layout(template, styles)
export default class OverviewTopbar extends Component {
    @service store!: DS.Store;
    @service toast!: Toast;
    @service intl!: Intl;

    registration!: RegistrationModel;

    bookmarksCollection!: CollectionModel;
    isBookmarked?: boolean;
    showDropdown: boolean = false;

    @task({ withTestWaiter: true, drop: true })
    forkRegistration = task(function *(this: OverviewTopbar, closeDropdown: () => void) {
        if (!this.registration) {
            return;
        }

        try {
            yield this.registration.makeFork();
            this.toast.success(
                this.intl.t('registries.overview.fork.success'),
                this.intl.t('registries.overview.fork.success_title'),
            );
        } catch (e) {
            const errorMessage = this.intl.t('registries.overview.fork.error');
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
            throw e;
        } finally {
            closeDropdown();
        }
    });

    @task({ withTestWaiter: true, drop: true })
    bookmark = task(function *(this: OverviewTopbar) {
        if (!this.bookmarksCollection || !this.registration) {
            return;
        }

        const op = this.isBookmarked ? 'remove' : 'add';

        try {
            if (op === 'remove') {
                this.bookmarksCollection.linkedRegistrations.removeObject(this.registration);
                yield this.bookmarksCollection.deleteM2MRelationship(
                    'linkedRegistrations',
                    this.registration,
                );
            } else {
                this.bookmarksCollection.linkedRegistrations.pushObject(this.registration);
                yield this.bookmarksCollection.createM2MRelationship(
                    'linkedRegistrations',
                    this.registration,
                );
            }
        } catch (e) {
            const errorMessage = this.intl.t(`registries.overview.bookmark.${op}.error`);
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
            throw e;
        }

        this.toast.success(this.intl.t(`registries.overview.bookmark.${op}.success`));

        this.toggleProperty('isBookmarked');
    });

    @task({ withTestWaiter: true, on: 'init' })
    getBookmarksCollection = task(function *(this: OverviewTopbar) {
        const collections = yield this.store.findAll('collection', {
            adapterOptions: { 'filter[bookmarks]': 'true' },
        });

        if (!collections.length) {
            return;
        }

        this.set('bookmarksCollection', collections.firstObject);

        const bookmarkedRegs = yield this.bookmarksCollection.linkedRegistrations;
        const isBookmarked = Boolean(bookmarkedRegs.find((reg: RegistrationModel) => reg.id === this.registration.id));

        this.set('isBookmarked', isBookmarked);
    });

    @computed('registration.reviewsState')
    get isWithdrawn() {
        return this.registration.reviewsState === RegistrationReviewStates.Withdrawn;
    }

    @computed('registration.id')
    get registrationURL() {
        return this.registration && pathJoin(baseURL, `${this.registration.id}`);
    }
}
