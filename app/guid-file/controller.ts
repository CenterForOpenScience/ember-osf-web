import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

import Media from 'ember-responsive';
export default class GuidFile extends Controller {
    @service media!: Media;

    @tracked rightClosed = true;
    @tracked revisionsOpen = false;
    @tracked tagsOpen = false;

    get isMobile() {
        return this.media.isMobile;
    }

    get isTablet() {
        return this.media.isTablet;
    }

    get revisionsVisible() {
        return this.revisionsOpen && !this.rightClosed;
    }

    get tagsVisible() {
        return this.tagsOpen && !this.rightClosed;
    }

    @action
    toggleRevisions() {
        if (this.revisionsOpen && !this.rightClosed) {
            this.rightClosed = true;
        } else {
            this.revisionsOpen = true;
            this.tagsOpen = false;
            this.rightClosed = false;
        }
    }

    @action
    toggleTags() {
        if (this.tagsOpen && !this.rightClosed) {
            this.rightClosed = true;
        } else {
            this.tagsOpen = true;
            this.revisionsOpen = false;
            this.rightClosed = false;
        }
    }
}
