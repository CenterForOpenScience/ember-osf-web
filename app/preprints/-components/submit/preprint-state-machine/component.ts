import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import Theme from 'ember-osf-web/services/theme';
import Intl from 'ember-intl/services/intl';
import PreprintModel from 'ember-osf-web/models/preprint';
import Media from 'ember-responsive';

interface InputArgs {
    submission: PreprintModel;
}

export default class PreprintStateMachine extends Component<InputArgs>{
    @service intl!: Intl;
    @service theme!: Theme;
    @service media!: Media;

    get isMobile() {
        return this.media.isMobile;
    }
}
