/* tslint:disable:object-literal-sort-keys max-line-length */

export default {
    general: {
        share: 'Share',
        embed: 'Embed',
        download: 'Download',
        delete: 'Delete',
        view: 'View',
        edit: 'Edit',
        cancel: 'Cancel',
        revisions: 'Revisions',
        md5: 'MD5',
        date: 'Date',
        sha2: 'SHA2',
    },
    quickfiles: {
        title: '{{user-name}}\'s Quick Files',
        description: 'Files uploaded here are <b>publicly accessible</b> and easy to share with others using the share link.',
        feedback_dialog_text: 'Tell us what you think of Quick Files',
        transition_auth: 'You must be logged in to view your Quick Files. Redirecting to the login page.',
    },
    feedback: {
        button_text: 'Feedback',
        placeholder: 'Share your feedback',
        follow_up_label: 'Contact me about further opportunities to improve the OSF',
        title: 'Send feedback',
        confirm_button_text: 'Send',
        thank_you: 'Thank you!',
        success: 'Your feedback has been submitted.',
        dismiss: 'Got it',
    },
    file_detail: {
        version: {
            id: 'Version ID',
            title: '(Version: {{version-number}})',
        },
        embed: {
            dynamic: 'Dynamically render iframe with JavaScript',
            direct: 'Direct iframe with fixed height and width',
        },
        tags: 'Tags:',
        toggle: 'Toggle view:',
        delete_file: {
            question: 'Delete file?',
            confirm: 'Are you sure you want to delete <b>{{file-name}}</b>',
        },
        sha2_description: 'SHA-2 is a cryptographic hash function designed by the NSA used to verify data integrity.',
        md5_description: 'MD5 is an algorithm used to verify data integrity.',
        // toast messages
        delete_success: 'File deleted',
        delete_fail: 'Error, unable to delete file',
        save_success: 'File saved',
        save_fail: 'Error, unable to save file',
    },
};
