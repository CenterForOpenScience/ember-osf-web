import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import config from 'ember-get-config';
import $ from 'jquery';

const {
    microfeedback: { enabled, pageParams, url },
    OSF: { backend },
} = config;

function sendFeedback(body: string, {
    extra,
    followup,
    pageName,
    userID,
}: {
    extra?: object,
    followup: boolean,
    pageName: string,
    userID: string,
}): Promise<any> {
    const payload = {
        body,
        extra: {
            followup,
            user: userID ? `[${userID}|${window.location.origin}/${userID}/]` : undefined,
            ...extra,
        },
    };

    const params = [
        (backend !== 'prod') ? { name: 'label', value: 'testing' } : undefined,
        followup ? { name: 'label', value: 'followup' } : undefined,
        ...Object.entries(pageParams[pageName] || {})
            .map(([ name, value ]) => ({ name, value })),
    ].filter((val) => !!val);

    if (!url) {
        return;
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

export default class FeedbackButton extends Component.extend({
    pageName:  null,
    text: '',

    actions: {
        showDialog(this: FeedbackButton) {
            this.set('state', DialogState.active);
        },

        hideDialog(this: FeedbackButton) {
            this.set('state', DialogState.empty);
            this.reset();
        },

        submit(this: FeedbackButton) {
            const body = this.get('body');

            // Dismiss if no input
            if (!body) {
                this.set('state', DialogState.empty);
                this.reset();
                return;
            }

            // Optimistically display success message
            this.set('state', DialogState.success);
            sendFeedback(
                body,
                {
                    followup: this.get('followup'),
                    pageName: this.get('pageName'),
                    userID: this.get('currentUser.currentUserId'),
                },
            );
            this.reset();
        },
    },
}) {
    private currentUser = service('currentUser');

    private enabled: boolean = enabled;

    private body: string = '';

    private followup: boolean = false;

    private state: DialogState = DialogState.empty;
    private dialogRows = 5;

    private open = computed('state', function(): boolean {
        const state = this.get('state');
        return state === DialogState.active || state === DialogState.success;
    });

    private active = computed('state', function(): boolean {
        return this.get('state') === DialogState.active;
    });

    private success = computed('state', function(): boolean {
        return this.get('state') === DialogState.success;
    });

    private modalClass = computed('styleNamespace', function(): string {
        return `${this.get('styleNamespace')}Modal`;
    });

    private reset(): void {
        this.set('body', '');
        this.set('followup', false);
    }
}

declare module '@ember/component' {
    interface IRegistry {
        'feedback-button': FeedbackButton;
    }
}
