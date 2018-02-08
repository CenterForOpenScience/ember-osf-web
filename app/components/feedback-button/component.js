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
                const confirmButtonText = this.get('confirmButtonText');
                const cancelButtonText = this.get('cancelButtonText');
                return btn.alert({
                    html: this.$().html(),
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
