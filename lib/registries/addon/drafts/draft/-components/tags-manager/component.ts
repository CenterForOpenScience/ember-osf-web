import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action } from '@ember/object';
import { ChangesetDef } from 'ember-changeset/types';
import config from 'ember-get-config';
import { layout } from 'ember-osf-web/decorators/component';
import pathJoin from 'ember-osf-web/utils/path-join';
import template from './template';

const {
    OSF: { url: baseUrl },
} = config;

@tagName('')
@layout(template)
export default class MetadataTagsManagerComponent extends Component {
    // required
    changeset!: ChangesetDef;
    valuePath!: string;

    // properties
    tags: string[] = [];

    @action
    addTag(tag: string) {
        this.set('tags', [...this.tags, tag].sort());
        this.changeset.set(this.valuePath, this.tags);
    }

    @action
    removeTag(index: number) {
        this.set('tags', this.tags.slice().removeAt(index));
        this.changeset.set(this.valuePath, this.tags);
    }

    @action
    clickTag(tag: string): void {
        window.location.assign(`${pathJoin(baseUrl, 'search')}?q=(tags:"${encodeURIComponent(tag)}")`);
    }
}
