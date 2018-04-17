import { service } from '@ember-decorators/service';
import Service from '@ember/service';
import config from 'ember-get-config';

const {
    OSF: {
        cookieDomain,
        statusCookie,
    },
} = config;

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
        this.nextMessages = this.getCookieMessages();
    }

    getCookieMessages(this: StatusMessages): StatusMessage[] {
        const cookies = this.get('cookies');
        const readCookie: string = cookies.read(statusCookie);

        if (!readCookie) {
            return [];
        }

        cookies.clear(statusCookie, {
            domain: cookieDomain,
            path: '/',
        });

        const status = readCookie
            .replace(/\\054/g, ',')
            .replace(/^"|\\|"$/g, '');

        return JSON.parse(status)
            .map(message => ({ ...message, id: `status.${message.id}` }));
    }

    addStatusMessage(this: StatusMessages, message: StatusMessage): void {
        this.get('nextMessages').push(message);
    }

    updateMessages(this: StatusMessages): void {
        this.setProperties({
            messages: this.get('nextMessages') || [],
            nextMessages: [],
        });
    }
}

declare module '@ember/service' {
    interface Registry {
        'status-messages': StatusMessages;
    }
}
