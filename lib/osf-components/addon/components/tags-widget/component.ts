import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { localClassName } from 'ember-css-modules';
import config from 'ember-get-config';

import { layout } from 'ember-osf-web/decorators/component';
import Analytics from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';
import pathJoin from 'ember-osf-web/utils/path-join';

import styles from './styles';
import template from './template';

const { OSF: { url: baseUrl } } = config;

@layout(template, styles)
export default class TagsWidget extends Component.extend({ styles }) {
    // required arguments
    tags?: string[];

    // optional arguments
    readOnly: boolean = defaultTo(this.readOnly, false);
    addTag?: (tag: string) => void;
    removeTag?: (index: number) => void;
    @localClassName('show-add', 'hide-add') showAdd: boolean = defaultTo(this.showAdd, false);
    @localClassName('inline') inline: boolean = defaultTo(this.inline, false);

    // private properties
    @service analytics!: Analytics;

    constructor(properties: object) {
        super(properties);
        assert('tags-widget: You must pass in a tags array', Array.isArray(this.tags));
        if (this.readOnly) {
            assert('tags-widget: showAdd=true has no effect when readOnly=true', !this.showAdd);
        } else {
            assert(
                'tags-widget: You must pass in an addTag action when readOnly=false',
                typeof this.addTag === 'function',
            );
            assert(
                'tags-widget: You must pass in a removeTag action when readOnly=false',
                typeof this.removeTag === 'function',
            );
        }
    }

    @action
    _addTag(tag: string) {
        if (this.addTag) {
            this.analytics.click('button', 'Tags widget - Add tag');
            this.addTag(tag);
        }
    }

    @action
    _removeTag(index: number) {
        if (this.removeTag) {
            this.analytics.click('button', 'Tags widget - Remove tag');
            this.removeTag(index);
        }
    }

    @action
    _clickTag(tag: string): void {
        this.analytics.click('link', 'Tags widget - Search by tag');
        window.location.assign(`${pathJoin(baseUrl, 'search')}?q=(tags:"${encodeURIComponent(tag)}")`);
    }
}
