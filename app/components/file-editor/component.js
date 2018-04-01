import Component from '@ember/component';
import { computed } from '@ember/object';
import { next } from '@ember/runloop';

/**
 * @module ember-osf
 * @submodule components
 */

/**
 * Edit the chosen file
 *
 * Sample usage:
 * ```handlebars
 * {{file-editor
     fileText=fileText
     save=(action 'save')}}
 * ```
 * @class file-editor
 */

export default Component.extend({
    classNames: ['FileEditor'],
    fileText: '',
    unsavedText: '',

    newText: computed('fileText', function() {
        return String(this.get('fileText'));
    }),

    actions: {
        valueUpdated(newValue) {
            this.set('unsavedText', newValue);
        },
        revertText() {
            const fileText = this.get('fileText');
            this.set('fileText', '');
            // Restore original text in next tick of the run loop to trigger re-render of ember-ace
            next(() => this.set('fileText', fileText));
        },
        saveText() {
            this.attrs.save(this.get('unsavedText'));
        },
    },
});
