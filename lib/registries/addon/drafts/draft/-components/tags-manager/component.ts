import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, set } from '@ember/object';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import { BufferedChangeset } from 'ember-changeset/types';

import { layout } from 'ember-osf-web/decorators/component';
import DraftRegistrationModel from 'ember-osf-web/models/draft-registration';
import { TagsManager } from 'osf-components/components/editable-field/tags-manager/component';

import template from './template';

export type MetadataTagsManager = Pick<TagsManager, 'addTag' | 'removeTag' | 'clickTag' | 'tags'>;

@tagName('')
@layout(template)
export default class MetadataTagsManagerComponent extends Component {
    @service router!: RouterService;
    // required
    changeset!: BufferedChangeset;
    valuePath!: string;
    readOnly = false;

    // optional
    registration?: DraftRegistrationModel;
    onMetadataInput?: () => void;

    // properties
    tags: string[] = [];

    didReceiveAttrs() {
        if (this.changeset && !this.readOnly) {
            set(this, 'tags', this.changeset.get(this.valuePath).slice());
        }
    }

    @action
    addTag(tag: string) {
        set(this, 'tags', [...this.tags, tag].sort());
        set(this.changeset, this.valuePath, this.tags);
        if (this.onMetadataInput) {
            this.onMetadataInput();
        }
    }

    @action
    removeTag(index: number) {
        set(this, 'tags', this.tags.slice().removeAt(index));
        set(this.changeset, this.valuePath, this.tags);
        if (this.onMetadataInput) {
            this.onMetadataInput();
        }
    }

    @action
    clickTag(tag: string): void {
        this.router.transitionTo('search', { queryParams: { q: `${encodeURIComponent(tag)}` } });
    }
}
