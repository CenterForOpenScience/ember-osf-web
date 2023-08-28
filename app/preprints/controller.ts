
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

import Theme from 'ember-osf-web/services/theme';

export default class PreprintController extends Controller {
    @service theme!: Theme;
}
