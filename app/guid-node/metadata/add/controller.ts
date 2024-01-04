import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive';
import config from 'ember-osf-web/config/environment';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class GuidMetadataAdd extends Controller {
    @service media!: Media;

    supportEmail = config.support.supportEmail;

    @tracked displaySelectionOptions = true;

    @action
    // eslint-disable-next-line
    selectTemplate(cedarId: string): void {
        this.displaySelectionOptions = false;
        // console.log(this.model.templates.length);
        // console.log('selected', cedarId);
    }

    get isMobile() {
        return this.media.isMobile;
    }
}
