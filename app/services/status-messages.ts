import Service, { inject as service } from '@ember/service';
import Cookies from 'ember-cookies/services/cookies';
import config from 'ember-get-config';

const {
    OSF: {
        cookieDomain,
        cookies: {
            status: statusCookie,
        },
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
    @service cookies!: Cookies;

    messages?: StatusMessage[];
    nextMessages: StatusMessage[];

    constructor(...args: any[]) {
        super(...args);
        this.nextMessages = this.getCookieMessages();
    }

    getCookieMessages(): StatusMessage[] {
        const { cookies } = this;
        const readCookie = cookies.read(statusCookie);

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
            .map((message: {id: string}) => ({ ...message, id: `status.${message.id}` }));
    }

    addStatusMessage(message: StatusMessage): void {
        this.nextMessages.push(message);
    }

    updateMessages(): void {
        this.setProperties({
            messages: this.nextMessages ?? [],
            nextMessages: [],
        });
    }
}

declare module '@ember/service' {
    interface Registry {
        'status-messages': StatusMessages;
    }
}
