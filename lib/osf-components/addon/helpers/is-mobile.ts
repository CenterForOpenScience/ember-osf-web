import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive';

export default class IsMobileHelper extends Helper {
    @service media!: Media;

    compute(): boolean {
        return this.media.isMobile;
    }
}
