import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive';

export default class MeetingsFooter extends Component {
    @service media!: Media;

    get isMobile() {
        return this.media.isMobile;
    }
}
