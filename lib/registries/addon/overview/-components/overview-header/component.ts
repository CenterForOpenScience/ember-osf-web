import Component from '@ember/component';
import { not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive';

import Brand from 'registries/services/brand';

export default class OverviewHeader extends Component {
    @service media!: Media;
    @service brand!: Brand;
    @not('media.isDesktop') showMobileView!: boolean;
}
