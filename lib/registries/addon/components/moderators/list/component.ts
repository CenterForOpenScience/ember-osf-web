import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import CurrentUserService from 'ember-osf-web/services/current-user';
import ModeratorManager from '../manager/component';
import template from './template';

@tagName('')
@layout(template)
export default class ModeratorList extends Component {
    @service currentUser!: CurrentUserService;
    @service toast!: Toast;

    manager!: ModeratorManager;
}
