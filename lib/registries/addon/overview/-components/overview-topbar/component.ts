import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import DS from 'ember-data';
import config from 'ember-get-config';
import I18N from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import CollectionModel from 'ember-osf-web/models/collection';
import RegistrationModel, { RegistrationState } from 'ember-osf-web/models/registration';
import pathJoin from 'ember-osf-web/utils/path-join';

import styles from './styles';
import template from './template';

const { OSF: { url: baseURL } } = config;

@tagName('')
@layout(template, styles)
export default class OverviewTopbar extends Component.extend({
    forkRegistration: task(function *(this: OverviewTopbar, closeDropdown: () => void) {
        if (!this.registration) {
            return;
        }

        try {
            yield this.registration.makeFork();
            this.toast.success(
                this.i18n.t('registries.overview.fork.success'),
                this.i18n.t('registries.overview.fork.success_title'),
            );
        } catch (e) {
            this.toast.error(this.i18n.t('registries.overview.fork.error'));
            throw e;
        } finally {
            closeDropdown();
        }
    }).drop(),
    bookmark: task(function *(this: OverviewTopbar) {
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
            this.toast.error(this.i18n.t(`registries.overview.bookmark.${op}.error`));
            throw e;
        }

        this.toast.success(this.i18n.t(`registries.overview.bookmark.${op}.success`));

        this.toggleProperty('isBookmarked');
    }).drop(),
    getBookmarksCollection: task(function *(this: OverviewTopbar) {
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
    }).on('init'),
}) {
    @service store!: DS.Store;
    @service toast!: Toast;
    @service i18n!: I18N;

    registration!: RegistrationModel;

    bookmarksCollection!: CollectionModel;
    isBookmarked?: boolean;

    @computed('registration.state')
    get isWithdrawn() {
        return this.registration.state === RegistrationState.Withdrawn;
    }

    @computed('registration.id')
    get registrationURL() {
        return this.registration && pathJoin(baseURL, `${this.registration.id}`);
    }
}
