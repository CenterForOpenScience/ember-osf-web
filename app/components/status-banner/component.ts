import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';

import { StatusMessage } from 'ember-osf-web/services/status-messages';

export default class StatusBanner extends Component {
    @service statusMessages;

    @alias('statusMessages.messages') messages!: StatusMessage[];
}
