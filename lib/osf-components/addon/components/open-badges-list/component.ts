import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import Media from 'ember-responsive';

export default class OpenBadgesList extends Component {
    @service media!: Media;

    get isMobile() {
        return this.media.isMobile;
    }
}
