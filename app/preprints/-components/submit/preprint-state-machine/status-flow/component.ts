import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive';

export default class StatusFlow extends Component{
    @service media!: Media;

    get isMobile() {
        return this.media.isMobile;
    }
}
