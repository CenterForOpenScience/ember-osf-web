import Controller from '@ember/controller';
import { action } from '@ember/object';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { taskFor } from 'ember-concurrency-ts';
import Intl from 'ember-intl/services/intl';
import Media from 'ember-responsive';
import Toast from 'ember-toastr/services/toast';

export default class GuidFile extends Controller {
    @service media!: Media;
    @service toast!: Toast;
    @service router!: RouterService;
    @service intl!: Intl;

    @tracked revisionsOpened = false;
    @tracked tagsOpened = false;
    @tracked metadataOpened = !this.isMobile;
    @tracked resourceHelpOpen = false;

    @tracked viewedVersion?: number;

    get rightColumnClosed() {
        return !(this.revisionsOpened || this.tagsOpened || this.metadataOpened);
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
            this.metadataOpened = false;
        } else {
            if (this.tagsOpened) {
                this.tagsOpened = false;
            }
            if (this.metadataOpened) {
                this.metadataOpened = false;
            }
            this.toggleProperty('revisionsOpened');
        }
    }

    @action
    toggleTags() {
        if (this.isMobile) {
            this.tagsOpened = true;
            this.revisionsOpened = false;
            this.metadataOpened = false;
        } else {
            if (this.revisionsOpened) {
                this.revisionsOpened = false;
            }
            if (this.metadataOpened) {
                this.metadataOpened = false;
            }
            this.toggleProperty('tagsOpened');
        }
    }

    @action
    toggleMetadata() {
        if (this.isMobile) {
            this.tagsOpened = false;
            this.revisionsOpened = false;
            this.metadataOpened = true;
        } else {
            if (this.revisionsOpened) {
                this.revisionsOpened = false;
            }
            if (this.tagsOpened) {
                this.tagsOpened = false;
            }
            this.toggleProperty('metadataOpened');
        }
    }

    @action
    toggleFileRenderer() {
        if (this.isMobile) {
            this.tagsOpened = false;
            this.revisionsOpened = false;
            this.metadataOpened = false;
        } else {
            if (this.rightColumnClosed) {
                this.metadataOpened = true;
                this.revisionsOpened = false;
                this.tagsOpened = false;
            } else {
                this.revisionsOpened = false;
                this.tagsOpened = false;
                this.metadataOpened = false;
            }
        }
    }

    @action
    onDelete() {
        this.router.transitionTo('guid-node.files', this.model.fileModel.target.get('id'));
    }
}
