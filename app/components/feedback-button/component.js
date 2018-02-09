import Component from '@ember/component';
import $ from 'jquery';
import { computed } from '@ember/object';
import config from 'ember-get-config';


function sendFeedback(body, {
    user,
    followup,
    pageName,
    extra,
} = {}) {
    let { url } = config.microfeedback;
    const extraBase = { followup };
    if (user) {
        const userLink = `[${user.get('fullName')}|${user.get('profileURL')}]`;
        extraBase.user = userLink;
    }
    const payload = {
        body,
        extra: Object.assign({}, extraBase, extra),
    };
    if (url) {
        // Add page-specific query params
        const params = config.microfeedback.pageParams[pageName];
        if (params) {
            const query = $.param(params);
            url += `?${query}`;
        }

        return $.ajax(url, {
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(payload),
        });
    } else { // Log feedback in development environments
        /* eslint-disable no-console */
        console.warn('MICROFEEDBACK_URL is not configured. Feedback will only be logged to the console.');
        console.debug('DEBUG: MicroFeedback payload:');
        console.debug(payload);
        /* eslint-enable no-console */
    }
}

export default Component.extend({
    body: '',
    text: '',
    pageName: null,
    followup: false,
    user: null,
    // Valid states: null (unopened), 'active', 'success'
    state: null,
    dialogRows: 5,
    open: computed('state', function() {
        const state = this.get('state');
        return state === 'active' || state === 'success';
    }),
    active: computed('state', function() {
        return this.get('state') === 'active';
    }),
    success: computed('state', function() {
        return this.get('state') === 'success';
    }),
    modalClass: computed('styleNamespace', function() {
        return `${this.get('styleNamespace')}Modal`;
    }),
    actions: {
        showDialog() {
            this.set('state', 'active');
        },
        hideDialog() {
            this.set('state', null);
            this.reset();
        },
        submit() {
            const body = this.get('body');
            // Dismiss if no input
            if (!body) {
                this.set('state', null);
                this.reset();
                return;
            }
            // Optimistically display success message
            this.set('state', 'success');
            sendFeedback(
                body,
                {
                    followup: this.get('followup'),
                    user: this.get('user'),
                    pageName: this.get('pageName'),
                },
            );
            this.reset();
        },
    },
    reset() {
        this.set('body', '');
        this.set('followup', false);
    },
});
