import Controller from '@ember/controller';
import { action } from '@ember/object';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { taskFor } from 'ember-concurrency-ts';
import Media from 'ember-responsive';
import Toast from 'ember-toastr/services/toast';

export default class GuidFile extends Controller {
    @service media!: Media;
    @service toast!: Toast;
    @service router!: RouterService;

    @tracked revisionsOpened = false;
    @tracked tagsOpened = false;

    @tracked viewedVersion?: number;

    get rightColumnClosed() {
        return !(this.revisionsOpened || this.tagsOpened);
    }

    get isMobile() {
        return this.media.isMobile;
    }

    get isTablet() {
        return this.media.isTablet;
    }

    @action
    changeVersion(version: number) {
        this.viewedVersion = version;
    }

    @action
    toggleRevisions() {
        if (!this.model.waterButlerRevisions) {
            taskFor(this.model.getRevisions).perform();
        }
        if (this.isMobile) {
            this.revisionsOpened = true;
            this.tagsOpened = false;
        } else {
            if (this.tagsOpened) {
                this.tagsOpened = false;
            }
            this.toggleProperty('revisionsOpened');
        }
    }

    @action
    toggleTags() {
        if (this.isMobile) {
            this.tagsOpened = true;
            this.revisionsOpened = false;
        } else {
            if (this.revisionsOpened) {
                this.revisionsOpened = false;
            }
            this.toggleProperty('tagsOpened');
        }
    }

    @action
    toggleFileRenderer() {
        if (this.isMobile) {
            this.tagsOpened = false;
            this.revisionsOpened = false;
        } else {
            if (this.rightColumnClosed) {
                this.revisionsOpened = true;
                this.tagsOpened = false;
            } else {
                this.revisionsOpened = false;
                this.tagsOpened = false;
            }
        }
    }

    @action
    onDelete() {
        this.router.transitionTo('guid-node.files', this.model.fileModel.target.get('id'));
    }
}
