import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';

import { StatusMessage } from 'ember-osf-web/services/status-messages';

export default class StatusBanner extends Component {
    @service statusMessages;
    transitionListener: boolean;

    constructor() {
        super();
        this.get('statusMessages').getMessages();
    }

    @computed('statusMessages.messages')
    get messages(this: StatusBanner): StatusMessage[] {
        return this.get('statusMessages.messages');
    }
}
