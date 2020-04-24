import Component from '@ember/component';
import { not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive';

export default class OverviewHeader extends Component {
    @service media!: Media;

    @not('media.isDesktop') showMobileView!: boolean;
}
