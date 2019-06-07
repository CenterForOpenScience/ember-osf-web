import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { alias, and } from '@ember-decorators/object/computed';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import config from 'ember-get-config';

import { layout } from 'ember-osf-web/decorators/component';
import Registration from 'ember-osf-web/models/registration';
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
export default class TagsManagerComponent extends Component.extend({
    save: task(function *(this: TagsManagerComponent) {
        this.registration.set('tags', [...this.currentTags]);
        yield this.registration.save();
        this.set('requestedEditMode', false);
    }),
}) {
    // required
    registration!: Registration;

    // private
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
