import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { localClassName } from 'ember-css-modules';
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
    autoSave: boolean = defaultTo(this.autoSave, true);
    @localClassName('hide-add', 'show-add')
    readOnly: boolean = defaultTo(this.readOnly, true);
    @localClassName('inline')
    inline: boolean = defaultTo(this.inline, false);
    shouldSearchOnClick: boolean = defaultTo(this.shouldSearchOnClick, false);
    onChange?: (taggable: Taggable) => void;

    // private properties
    @service analytics!: Analytics;

    constructor(properties: object) {
        super(properties);
        assert('tags-widget: You must pass in a taggable model', Boolean(this.taggable && 'tags' in this.taggable));
    }

    @action
    _addTag(tag: string) {
        this.taggable.set('tags', [...this.taggable.tags, tag].sort());
        this._onChange();
    }

    @action
    _removeTag(index: number) {
        this.taggable.set('tags', this.taggable.tags.slice().removeAt(index));
        this._onChange();
    }

    @action
    _clickTag(tag: string): void {
        this.analytics.click('link', 'Tags widget - Search by tag');
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
