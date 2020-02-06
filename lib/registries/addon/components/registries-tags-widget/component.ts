// import { assert } from '@ember/debug';
import { attribute } from '@ember-decorators/component';
import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

import { layout } from 'ember-osf-web/decorators/component';
import Analytics from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';
import { TagsManager } from 'osf-components/components/editable-field/tags-manager/component';
import { MetadataTagsManager } from 'registries/drafts/draft/-components/tags-manager/component';

import styles from './styles';
import template from './template';

@layout(template, styles)
export default class RegistriesTagsWidget extends Component.extend({ styles }) {
    // Required
    manager!: TagsManager | MetadataTagsManager;

    // Optional
    readOnly?: boolean = defaultTo(this.readOnly, false);

    // Private
    @service analytics!: Analytics;

    @attribute('data-analytics-scope')
    analyticsScope: string = defaultTo(this.analyticsScope, 'Tags');

    @action
    addTag(tag: string) {
        this.analytics.trackFromElement(this.element, {
            name: 'Add tag',
            category: 'tag',
            action: 'add',
        });
        this.manager.addTag(tag);
    }

    @action
    removeTag(index: number) {
        this.analytics.trackFromElement(this.element, {
            name: 'Remove tag',
            category: 'tag',
            action: 'remove',
        });
        this.manager.removeTag(index);
    }
}
