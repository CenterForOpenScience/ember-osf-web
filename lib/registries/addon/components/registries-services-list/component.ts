import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive';

import config from 'ember-osf-web/config/environment';

export default class RegistriesServiceList extends Component {
    @service media!: Media;

    assetsPrefix = config.assetsPrefix;

    get isMobile() {
        return this.media.isMobile;
    }
}
