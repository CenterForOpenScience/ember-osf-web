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
    statusMessages: StatusMessage[];

    _getCookieMessages(this: StatusMessages): StatusMessage[] {
        const cookies = this.get('cookies');
        if (!cookies.read(config.OSF.statusCookie)) {
            return [];
        }
        // decode commas and \\
        let status = cookies.read(config.OSF.statusCookie).replace(/\\054/g, ',').replace(/\\/g, '');
        // remove outside quotes
        status = status.slice(1).slice(0, -1);
        let messages = JSON.parse(status);
        messages = messages.map(each => {
            const updated = each;
            updated.id = `status.${each.id}`;
            return updated;
        });
        cookies.clear(config.OSF.statusCookie, {
            domain: config.environment === 'development' ? 'localhost' : '.osf.io',
            path: '/',
        });
        return messages;
    }

    _getStatusMessages(this: StatusMessages): StatusMessage[] {
        const messages = this.get('statusMessages') || [];
        this.set('statusMessages', []);
        return messages;
    }

    addMessage(this: StatusMessages): void {
        // add status message to the messages array
    }

    getMessages(this: StatusMessages): StatusMessage[] {
        const statMsg = this._getStatusMessages();
        const cookieMsg = this._getCookieMessages();
        const messages = statMsg.concat(cookieMsg);
        this.set('messages', messages);
        return messages;
    }

    clearMessages(this: StatusMessages): void {
        this.set('messages', []);
    }
}

declare module '@ember/service' {
    interface Registry {
        'status-messages': StatusMessages;
    }
}
