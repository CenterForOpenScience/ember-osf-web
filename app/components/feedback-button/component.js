import Component from '@ember/component';
import microfeedback from 'microfeedback-button';
import { inject as service } from '@ember/service';
import { translationMacro as t } from 'ember-i18n';
import $ from 'jquery';
import config from 'ember-get-config';

export default Component.extend({
    i18n: service('i18n'),
    text: '',
    buttonColor: '#52A452',
    placeholder: t('feedback.placeholder'),
    followUpLabel: t('feedback.follow_up_label'),
    title: t('feedback.title'),
    confirmButtonText: t('feedback.confirm_button_text'),
    cancelButtonText: t('general.cancel'),
    didInsertElement() {
        const buttonColor = this.get('buttonColor');
        const styleNamespace = this.get('styleNamespace');
        let url = config.MICROFEEDBACK_URL;
        // Add componentID to query params if provided
        if (url) {
            const params = {};
            if (this.get('componentID')) {
                params.componentID = this.get('componentID');
            }
            if (this.get('priorityID')) {
                params.priorityID = this.get('priorityID');
            }
            const query = $.param(params);
            url += `?${query}`;
        }
        const btn = microfeedback({
            url,
            backgroundColor: buttonColor,
            buttonAriaLabel: this.get('title'),
            showDialog: (btn) => {
                const text = this.get('text');
                const placeholder = this.get('placeholder');
                const followUpLabel = this.get('followUpLabel');
                const title = this.get('title');
                const confirmButtonText = this.get('confirmButtonText');
                const cancelButtonText = this.get('cancelButtonText');
                return btn.alert({
                    html: `
                        <h2 class="swal2-title">${title}</h2>
                        <div id="swal2-content" style="display: block;">${text}</div>
                        <textarea id="microfeedback-input" class="${styleNamespace}Input swal2-textarea" placeholder="${placeholder}"></textarea>
                        <label id="microfeedback-followup" for="swal2-checkbox" class="${styleNamespace}CheckboxLabel swal2-checkbox">
                            <input class="${styleNamespace}Checkbox" type="checkbox">
                            <span>${followUpLabel}</span>
                        </label>
                    `,
                    customClass: styleNamespace,
                    buttonsStyling: false,
                    cancelButtonClass: 'btn btn-default',
                    confirmButtonClass: 'btn btn-success',
                    focusConfirm: false,
                    preConfirm() {
                        const input = document.getElementById('microfeedback-input');
                        const followup = document.querySelectorAll('#microfeedback-followup input')[0];
                        return {
                            input: input.value,
                            followup: followup.checked,
                        };
                    },
                    showCancelButton: true,
                    confirmButtonText,
                    cancelButtonText,
                    reverseButtons: true,
                });
            },
            getPayload: (btn, { value: { input, followup } }) => {
                const user = this.get('user');
                const userLink = `[${user.get('fullName')}|${user.get('profileURL')}]`;
                return {
                    body: input,
                    extra: {
                        followup,
                        user: userLink,
                    },
                };
            },
        });
        this.set('microfeedbackButton', btn);
    },
    willDestroyElement() {
        this.get('microfeedbackButton').destroy();
    },
});
