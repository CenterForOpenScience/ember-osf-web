import { service } from '@ember-decorators/service';
import Service from '@ember/service';
import config from 'ember-get-config';

export interface StatusMessage {
    id: string;
    jumbo?: boolean;
    dismiss: boolean;
    extra?: any;
    class: string;
}

export default class StatusMessages extends Service {
    @service cookies;

    messages: StatusMessage[];
    nextMessages: StatusMessage[];

    constructor() {
        super();
        this.nextMessages = this._getCookieMessages();
    }

    _getCookieMessages(this: StatusMessages): StatusMessage[] {
        const cookies = this.get('cookies');
        if (!cookies.read(config.OSF.statusCookie)) {
            return [];
        }
        // decode commas and \\
        let status = cookies.read(config.OSF.statusCookie).replace(/\\054/g, ',').replace(/\\/g, '');
        // remove outside quotes
        status = status.slice(1, -1);
        let messages = JSON.parse(status);
        messages = messages.map(each => {
            const updated = each;
            updated.id = `status.${each.id}`;
            return updated;
        });
        cookies.clear(config.OSF.statusCookie, {
            domain: config.OSF.cookieDomain,
            path: '/',
        });
        return messages;
    }

    addMessage(this: StatusMessages): void {
        // add status message to the messages array
    }

    updateMessages(this: StatusMessages): void {
        const messages = this.get('nextMessages') || [];
        this.setProperties({
            messages,
            nextMessages: [],
        });
    }
}

declare module '@ember/service' {
    interface Registry {
        'status-messages': StatusMessages;
    }
}
