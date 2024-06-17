import { attribute } from '@ember-decorators/component';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { action } from '@ember/object';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';

import { layout } from 'ember-osf-web/decorators/component';
import OsfModel from 'ember-osf-web/models/osf-model';
import Analytics from 'ember-osf-web/services/analytics';

import styles from './styles';
import template from './template';

interface Taggable extends OsfModel {
    tags: string[];
    isPreprint: boolean;
}

@layout(template, styles)
export default class TagsWidget extends Component.extend({ styles }) {
    @service router!: RouterService;

    // required arguments
    taggable!: Taggable;
    isPreprint = false;

    // optional arguments
    readOnly = true;
    autoSave = true;
    onChange?: (taggable: Taggable) => void;

    @attribute('data-analytics-scope')
    analyticsScope = 'Tags';

    // private properties
    @service analytics!: Analytics;

    init() {
        super.init();
        assert('tags-widget: You must pass in a taggable model', Boolean(this.taggable && 'tags' in this.taggable));
    }


    @action
    _addTag(tag: string) {
        this.analytics.trackFromElement(this.element, {
            name: 'Add tag',
            category: 'tag',
            action: 'add',
        });
        this.taggable.set('tags', [...this.taggable.tags, tag].sort());
        this._onChange();
    }

    @action
    _removeTag(index: number) {
        this.analytics.trackFromElement(this.element, {
            name: 'Remove tag',
            category: 'tag',
            action: 'remove',
        });
        this.taggable.set('tags', this.taggable.tags.slice().removeAt(index));
        this._onChange();
    }

    @action
    _clickTag(tag: string): void {
        if (!this.isPreprint) {
            this.router.transitionTo('search', { queryParams: { q: `${encodeURIComponent(tag)}` } });
        }
    }

    _onChange() {
        if (this.autoSave) {
            this.taggable.save();
        }
        if (this.onChange) {
            this.onChange(this.taggable);
        }
    }
}
