import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import config from 'ember-get-config';

import { localClassName } from 'ember-osf-web/decorators/css-modules';
import Analytics from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';
import pathJoin from 'ember-osf-web/utils/path-join';

import styles from './styles';
import layout from './template';

const { OSF: { url: baseUrl } } = config;

export default class TagsWidget extends Component.extend({ styles }) {
    // required arguments
    tags?: string[];
    analyticsScope?: string;

    // optional arguments
    readOnly: boolean = defaultTo(this.readOnly, false);
    addTag?: (tag: string) => void;
    removeTag?: (index: number) => void;
    @localClassName('show-add', 'hide-add') showAdd: boolean = defaultTo(this.showAdd, false);
    @localClassName('inline') inline: boolean = defaultTo(this.inline, false);

    // private properties
    layout = layout;
    @service analytics!: Analytics;

    constructor(properties: object) {
        super(properties);
        assert('tags-widget: You must pass in a tags array', Array.isArray(this.tags));
        assert('tags-widget: You must pass in an analytics scope', typeof this.analyticsScope === 'string');
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
            this.analytics.click('button', `${this.analyticsScope} - Add tag`);
            this.addTag(tag);
        }
    }

    @action
    _removeTag(index: number) {
        if (this.removeTag) {
            this.analytics.click('button', `${this.analyticsScope} - Remove tag`);
            this.removeTag(index);
        }
    }

    @action
    _clickTag(tag: string): void {
        this.analytics.click('link', `${this.analyticsScope} - Search by tag`);
        window.location.assign(`${pathJoin(baseUrl, 'search')}?q=(tags:"${encodeURIComponent(tag)}")`);
    }
}
