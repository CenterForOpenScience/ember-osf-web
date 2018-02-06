import Component from '@ember/component';
import microfeedback from 'microfeedback-button';
import config from '../../config/environment';

export default Component.extend({
    didInsertElement() {
        const buttonColor = this.get('buttonColor') || '#52A452';
        const btn = microfeedback({
            url: config.MICROFEEDBACK_URL,
            backgroundColor: buttonColor,
            showDialog: (btn) => {
                const text = this.get('text') || '';
                const placeholder = this.get('placeholder') || 'Describe your issue or share your ideas';
                const followUpLabel = this.get('followUpLabel') || 'Contact me about opportunities to improve the OSF';
                return btn.alert({
                    html: `<h2 class="swal2-title">Send feedback</h2>
                    <div id="swal2-content" style="display: block;">${text}</div>
                    <textarea id="microfeedback-input" class="swal2-textarea" style="display: block;margin-bottom: 0;" placeholder="${placeholder}"></textarea>
                    <label style="font-weight: 300;" id="microfeedback-followup" for="swal2-checkbox" class="swal2-checkbox">
                    <input style="display:block" type="checkbox">
                    <span>${followUpLabel}</span>
                    </label>`,
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
                    confirmButtonText: 'Send',
                    confirmButtonColor: buttonColor,
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
        this.set('microfeedback-button', btn);
    },
    willDestroyElement() {
        this.get('microfeedback-button').destroy();
    },
});
