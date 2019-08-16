import { not } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import Media from 'ember-responsive';

export default class OverviewHeader extends Component {
    @service media!: Media;
    @not('media.isDesktop') showMobileView!: boolean;
}
