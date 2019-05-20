import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import config from 'ember-get-config';

import { layout } from 'ember-osf-web/decorators/component';
import Registration from 'ember-osf-web/models/registration';
import pathJoin from 'ember-osf-web/utils/path-join';
import template from './template';

const { OSF: { url: baseUrl } } = config;

@tagName('')
@layout(template)
export default class TagsManager extends Component.extend({
    save: task(function *(this: TagsManager) {
        this.registration.set('tags', [...this.currentTags]);
        yield this.registration.save();
        this.set('inEditMode', false);
    }),
}) {
    // required
    registration!: Registration;

    // private
    inEditMode: boolean = false;
    currentTags: string[] = [];

    @alias('registration.userHasAdminPermission') userCanEdit!: boolean;

    didReceiveAttrs() {
        if (this.registration) {
            this.setProperties({ currentTags: [...this.registration.tags] });
        }
    }

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
        this.set('inEditMode', true);
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
        this.set('inEditMode', false);
    }
}
