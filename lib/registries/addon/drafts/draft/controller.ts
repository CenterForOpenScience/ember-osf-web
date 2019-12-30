import Controller from '@ember/controller';
import { not } from '@ember/object/computed';
import { inject as service } from '@ember/service';

import Media from 'ember-responsive';

export default class RegistriesDraft extends Controller {
    @service media!: Media;

    @not('media.isDesktop') showMobileView!: boolean;
}
