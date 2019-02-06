import { attribute } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import config from 'ember-get-config';

import { layout } from 'ember-osf-web/decorators/component';
import File from 'ember-osf-web/models/file';
import Node from 'ember-osf-web/models/node';
import Analytics from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';
import pathJoin from 'ember-osf-web/utils/path-join';

import styles from './styles';
import template from './template';

const { OSF: { url: baseUrl } } = config;

type Taggable = Node | File;

@layout(template, styles)
export default class TagsWidget extends Component.extend({ styles }) {
    // required arguments
    taggable!: Taggable;

    // optional arguments
    readOnly: boolean = defaultTo(this.readOnly, true);
    autoSave: boolean = defaultTo(this.autoSave, true);
    onChange?: (taggable: Taggable) => void;

    @attribute('data-analytics-scope')
    analyticsScope: string = defaultTo(this.analyticsScope, 'Tags');

    // private properties
    @service analytics!: Analytics;

    constructor(properties: object) {
        super(properties);
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
        window.location.assign(`${pathJoin(baseUrl, 'search')}?q=(tags:"${encodeURIComponent(tag)}")`);
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
