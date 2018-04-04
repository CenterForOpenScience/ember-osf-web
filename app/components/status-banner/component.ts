import { service } from '@ember-decorators/service';
import Component from '@ember/component';

import { StatusMessage } from 'ember-osf-web/services/status-messages';

export default class StatusBanner extends Component.extend({
    didReceiveAttrs() {
        this.set('messages', this.get('statusMessages').getMessages());
    },
}) {
    @service statusMessages;
    messages: StatusMessage[];
}
