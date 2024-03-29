import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { alias, and } from '@ember/object/computed';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import Registration from 'ember-osf-web/models/registration';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

import template from './template';

export interface TagsManager {
    tags: string[];
    removeTag: (index: number) => void;
    addTag: (tag: string) => void;
    clickTag: (tag: string) => void;
    readOnly: boolean;
    registration: Registration;
}

@tagName('')
@layout(template)
export default class TagsManagerComponent extends Component {
    @service router!: RouterService;
    // required
    registration!: Registration;

    // private
    @service intl!: Intl;
    @service toast!: Toast;

    requestedEditMode = false;
    currentTags: string[] = [];

    @alias('registration.userHasWritePermission') userCanEdit!: boolean;

    @and('userCanEdit', 'requestedEditMode') inEditMode!: boolean;

    @computed('registration.tags.[]')
    get fieldIsEmpty() {
        return !this.registration.tags.length;
    }

    @computed('fieldIsEmpty', 'userCanEdit')
    get shouldShowField() {
        return this.userCanEdit || !this.fieldIsEmpty;
    }

    @task
    @waitFor
    async save() {
        this.registration.set('tags', [...this.currentTags]);
        try {
            await this.registration.save();
        } catch (e) {
            this.registration.rollbackAttributes();
            const errorMessage = this.intl.t('registries.registration_metadata.edit_tags.error');
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
            throw e;
        }
        this.set('requestedEditMode', false);
        this.toast.success(this.intl.t('registries.registration_metadata.edit_tags.success'));
    }

    @action
    startEditing() {
        this.setProperties({
            requestedEditMode: true,
            currentTags: [...this.registration.tags],
        });
    }

    @action
    addTag(tag: string) {
        this.setProperties({ currentTags: [...this.currentTags, tag].sort() });
    }

    @action
    removeTag(index: number) {
        this.setProperties({ currentTags: this.currentTags.slice().removeAt(index) });
    }

    @action
    clickTag(tag: string): void {
        this.router.transitionTo('search', { queryParams: { q: `${encodeURIComponent(tag)}` } });
    }

    @action
    cancel() {
        this.set('requestedEditMode', false);
    }
}
