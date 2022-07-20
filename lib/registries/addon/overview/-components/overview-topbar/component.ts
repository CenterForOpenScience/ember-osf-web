import Store from '@ember-data/store';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { dropTask, task } from 'ember-concurrency';
import config from 'ember-get-config';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';
import ResourceModel from 'ember-osf-web/models/resource';

import { taskFor } from 'ember-concurrency-ts';
import { layout } from 'ember-osf-web/decorators/component';
import CollectionModel from 'ember-osf-web/models/collection';
import RegistrationModel, { RegistrationReviewStates } from 'ember-osf-web/models/registration';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import pathJoin from 'ember-osf-web/utils/path-join';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';

import { tagName } from '@ember-decorators/component';
import styles from './styles';
import template from './template';

const { OSF: { url: baseURL } } = config;

@layout(template, styles)
@tagName('')
export default class OverviewTopbar extends Component {
    @service store!: Store;
    @service toast!: Toast;
    @service intl!: Intl;

    registration!: RegistrationModel;
    resources?: QueryHasManyResult<ResourceModel>;

    bookmarksCollection!: CollectionModel;
    isBookmarked?: boolean;
    showDropdown = false;

    constructor(...args: any[]) {
        super(...args);
        taskFor(this.getResources).perform();
    }

    @computed('registration.reviewsState')
    get isWithdrawn() {
        return this.registration.reviewsState === RegistrationReviewStates.Withdrawn;
    }

    @computed('registration.id')
    get registrationURL() {
        return this.registration && pathJoin(baseURL, `${this.registration.id}`);
    }

    @task({ on: 'init' })
    @waitFor
    async getBookmarksCollection() {
        const collections = await this.store.findAll('collection', {
            adapterOptions: { 'filter[bookmarks]': 'true' },
        });

        if (!collections.length) {
            return;
        }

        this.set('bookmarksCollection', collections.firstObject);

        const bookmarkedRegs = await this.bookmarksCollection.linkedRegistrations;
        const isBookmarked = Boolean(bookmarkedRegs.find((reg: RegistrationModel) => reg.id === this.registration.id));

        this.set('isBookmarked', isBookmarked);
    }

    @dropTask
    @waitFor
    async forkRegistration(closeDropdown: () => void) {
        if (!this.registration) {
            return;
        }

        try {
            await this.registration.makeFork();
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
    }

    @dropTask
    @waitFor
    async bookmark() {
        if (!this.bookmarksCollection || !this.registration) {
            return;
        }

        const op = this.isBookmarked ? 'remove' : 'add';

        try {
            if (op === 'remove') {
                this.bookmarksCollection.linkedRegistrations.removeObject(this.registration);
                await this.bookmarksCollection.deleteM2MRelationship(
                    'linkedRegistrations',
                    this.registration,
                );
            } else {
                this.bookmarksCollection.linkedRegistrations.pushObject(this.registration);
                await this.bookmarksCollection.createM2MRelationship(
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
    }

    @task
    @waitFor
    async getResources() {
        const resources: QueryHasManyResult<ResourceModel> = await this.registration.queryHasMany('resources');
        if (resources) {
            this.set('resources', resources);
        }
        console.log('resources from registration are:', resources);
        console.log('this.resources:', this.resources);
    }
}
