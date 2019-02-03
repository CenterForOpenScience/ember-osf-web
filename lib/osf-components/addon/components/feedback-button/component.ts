import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import config from 'ember-get-config';
import $ from 'jquery';
import RSVP from 'rsvp';

import { layout } from 'ember-osf-web/decorators/component';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';
import styles from './styles';
import template from './template';

const {
    microfeedback: { enabled, pageParams, url },
    OSF: { backend },
} = config;

interface FeedbackOptionalArgs {
    extra?: object;
    followup?: boolean;
    pageName?: string;
    userID?: string | null;
}

function sendFeedback(body: string, {
    extra,
    followup,
    pageName,
    userID,
}: FeedbackOptionalArgs): Promise<any> {
    const payload = {
        body,
        extra: {
            followup,
            user: userID ? `[${userID}|${config.OSF.url}${userID}/]` : undefined,
            ...extra,
        },
    };

    const params = [
        (backend !== 'prod') ? { name: 'label', value: 'testing' } : undefined,
        followup ? { name: 'label', value: 'followup' } : undefined,
        ...Object.entries(pageName ? pageParams[pageName] || {} : {})
            .map(([name, value]) => ({ name, value })),
    ].filter(val => !!val);

    if (!url) {
        return new RSVP.Promise((resolve, reject) => {
            reject('No URL defined!');
            resolve();
        });
    }

    return $.ajax(`${url}?${$.param(params)}`, {
        contentType: 'application/json',
        data: JSON.stringify(payload),
        dataType: 'json',
        method: 'POST',
    });
}

enum DialogState {
    empty = 'empty',
    active = 'active',
    success = 'success',
}

@layout(template, styles)
export default class FeedbackButton extends Component {
    pageName?: string;
    text?: string;

    @service analytics!: Analytics;
    @service currentUser!: CurrentUser;

    enabled: boolean = enabled;

    body: string = '';

    followup: boolean = false;

    state: DialogState = DialogState.empty;
    dialogRows = 5;

    @computed('state')
    get isOpen(): boolean {
        return this.state === DialogState.active || this.state === DialogState.success;
    }

    @computed('state')
    get isActive(): boolean {
        return this.state === DialogState.active;
    }

    @computed('state')
    get isSuccessful(): boolean {
        return this.state === DialogState.success;
    }

    reset(this: FeedbackButton): void {
        this.set('body', '');
        this.set('followup', false);
    }

    @action
    showDialog(this: FeedbackButton) {
        this.set('state', DialogState.active);
    }

    @action
    hideDialog(this: FeedbackButton) {
        this.set('state', DialogState.empty);
        this.reset();
    }

    @action
    submit(this: FeedbackButton) {
        // Dismiss if no input
        if (!this.body) {
            this.set('state', DialogState.empty);
            this.reset();
            return;
        }

        // Optimistically display success message
        this.set('state', DialogState.success);
        sendFeedback(
            this.body,
            {
                followup: this.followup,
                pageName: this.pageName,
                userID: this.currentUser.currentUserId,
            },
        );
        this.reset();
    }
}
