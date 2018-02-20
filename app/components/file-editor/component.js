import Ember from 'ember';
import layout from './template';

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

export default Ember.Component.extend({
    classNames: ['FileEditor'],
    layout,
    fileText: '',
    unsavedText: '',

    newText: Ember.computed('fileText', function() {
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
            Ember.run.next(() => this.set('fileText', fileText));
        },
        saveText() {
            this.attrs.save(this.get('unsavedText'));
        },
    },
});
