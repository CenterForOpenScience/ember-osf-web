import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

import Media from 'ember-responsive';


export default class GuidFile extends Controller {
    @service media!: Media;

    @tracked revisionsOpened = false;
    @tracked tagsOpened = false;
    @tracked rightColumnClosed = true;

    get isMobile() {
        return this.media.isMobile;
    }

    get isTablet() {
        return this.media.isTablet;
    }

    @action
    toggleRevisions() {
        if (this.tagsOpened) {
            this.tagsOpened = false;
        }
        this.toggleProperty('revisionsOpened');
        if (!this.revisionsOpened && !this.tagsOpened) {
            this.rightColumnClosed = true;
        } else {
            this.rightColumnClosed = false;
        }
    }

    @action
    toggleTags() {
        if (this.revisionsOpened) {
            this.revisionsOpened = false;
        }
        this.toggleProperty('tagsOpened');
        if (!this.revisionsOpened && !this.tagsOpened) {
            this.rightColumnClosed = true;
        } else {
            this.rightColumnClosed = false;
        }
    }

    @action
    toggleFileRenderer() {
        this.toggleProperty('rightColumnClosed');
        if (this.rightColumnClosed) {
            this.revisionsOpened = false;
            this.tagsOpened = false;
        } else {
            this.revisionsOpened = true;
            this.tagsOpened = false;
        }
    }
}
