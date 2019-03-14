import { tagName } from '@ember-decorators/component';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { DS } from 'ember-data';
import I18n from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import Collection from 'ember-osf-web/models/collection';
import Registration from 'ember-osf-web/models/registration';
import styles from './styles';
import template from './template';

@tagName('')
@layout(template, styles)
export default class SharingIconsDropdown extends Component.extend({
    bookmark: task(function *(this: SharingIconsDropdown) {
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
            this.toast.error(this.i18n.t(`registries.overview.update_bookmarks.${op}.error`));
            throw e;
        }

        this.toast.success(this.i18n.t(`registries.overview.update_bookmarks.${op}.success`));

        this.toggleProperty('isBookmarked');
    }).drop(),
    getBookmarksCollection: task(function *(this: SharingIconsDropdown) {
        const collections = yield this.store.findAll('collection', {
            adapterOptions: { 'filter[bookmarks]': 'true' },
        });

        if (!collections.length) {
            return;
        }

        this.set('bookmarksCollection', collections.firstObject);

        const bookmarkedRegs = yield this.bookmarksCollection.linkedRegistrations;
        const isBookmarked = Boolean(bookmarkedRegs.find((reg: Registration) => reg.id === this.registration.id));

        this.set('isBookmarked', isBookmarked);
    }).on('init'),
}) {
    @service store!: DS.Store;
    @service toast!: Toast;
    @service i18n!: I18n;

    registration!: Registration;
    bookmarksCollection!: Collection;
    isBookmarked?: boolean;
}
