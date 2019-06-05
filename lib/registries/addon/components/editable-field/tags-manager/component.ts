import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import config from 'ember-get-config';

import { layout } from 'ember-osf-web/decorators/component';
import Registration from 'ember-osf-web/models/registration';
import Analytics from 'ember-osf-web/services/analytics';
import pathJoin from 'ember-osf-web/utils/path-join';
import template from './template';

const { OSF: { url: baseUrl } } = config;

@tagName('')
@layout(template)
export default class TagsManager extends Component {
    // required
    registration!: Registration;

    // private properties
    @service analytics!: Analytics;

    currentTags: string[] = [];

    constructor(properties: object) {
        super(properties);
        if (this.registration) {
            this.setProperties({ currentTags: [...this.registration.tags] });
        }
    }

    @computed('registration.tags.length')
    get fieldIsEmpty() {
        return !this.registration.tags.length;
    }

    @computed('currentTags.length,registration.{tags.length,hasDirtyAttributes}')
    get fieldChanged() {
        return this.registration.tags.length !== this.currentTags.length ||
            !(this.registration.tags.every(tag => this.currentTags.includes(tag)));
    }

    @computed('fieldIsEmpty', 'registration.userHasAdminPermission')
    get shouldShowTitle() {
        return !this.fieldIsEmpty || this.registration.userHasAdminPermission;
    }

    @computed('fieldIsEmpty', 'registration.userHasAdminPermission')
    get shouldShowEmptyFieldText() {
        return this.fieldIsEmpty && this.registration.userHasAdminPermission;
    }

    @action
    addTag(tag: string) {
        this.analytics.trackFromElement(this.element, {
            name: 'Add tag',
            category: 'tag',
            action: 'add',
        });
        this.setProperties({ currentTags: [...this.currentTags, tag].sort() });
    }

    @action
    removeTag(index: number) {
        this.analytics.trackFromElement(this.element, {
            name: 'Remove tag',
            category: 'tag',
            action: 'remove',
        });
        this.setProperties({ currentTags: this.currentTags.slice().removeAt(index) });
    }

    @action
    clickTag(tag: string): void {
        window.location.assign(`${pathJoin(baseUrl, 'search')}?q=(tags:"${encodeURIComponent(tag)}")`);
    }

    @action
    save(hideEditable: () => void) {
        this.registration.set('tags', [...this.currentTags]);
        this.registration.save();
        hideEditable();
    }

    @action
    cancel(hideEditable: () => void) {
        if (this.fieldChanged) {
            this.setProperties({ currentTags: [...this.registration.tags] });
        }
        hideEditable();
    }
}
