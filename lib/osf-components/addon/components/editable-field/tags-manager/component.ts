import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { alias, and } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import config from 'ember-get-config';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import Registration from 'ember-osf-web/models/registration';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import pathJoin from 'ember-osf-web/utils/path-join';

import template from './template';

export interface TagsManager {
    tags: string[];
    removeTag: (index: number) => void;
    addTag: (tag: string) => void;
    clickTag: (tag: string) => void;
    readOnly: boolean;
    registration: Registration;
}

const {
    OSF: {
        url: baseUrl,
    },
} = config;

@tagName('')
@layout(template)
export default class TagsManagerComponent extends Component {
    // required
    registration!: Registration;

    // private
    @service intl!: Intl;
    @service toast!: Toast;

    requestedEditMode: boolean = false;
    currentTags: string[] = [];

    @alias('registration.userHasAdminPermission') userCanEdit!: boolean;

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
    save = task(function *(this: TagsManagerComponent) {
        this.registration.set('tags', [...this.currentTags]);
        try {
            yield this.registration.save();
        } catch (e) {
            this.registration.rollbackAttributes();
            captureException(e);
            this.toast.error(
                getApiErrorMessage(e) ||
                this.intl.t('registries.registration_metadata.edit_tags.error'),
            );
            throw e;
        }
        this.set('requestedEditMode', false);
        this.toast.success(this.intl.t('registries.registration_metadata.edit_tags.success'));
    });

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
        window.location.assign(`${pathJoin(baseUrl, 'search')}?q=(tags:"${encodeURIComponent(tag)}")`);
    }

    @action
    cancel() {
        this.set('requestedEditMode', false);
    }
}
