import { service } from '@ember-decorators/service';
import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import Node from 'ember-osf-web/models/node';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';
import defaultTo from 'ember-osf-web/utils/default-to';
import template from './template';

@layout(template)
export default class InstitutionWidget extends Component {
    // Required
    node?: Node;

    // optional properties
    shouldShowModal: boolean = defaultTo(this.shouldShowModal, false);

    // private properties
    @service analytics!: Analytics;
    @service currentUser!: CurrentUser;

    reloadList!: (page?: number) => void;
}
