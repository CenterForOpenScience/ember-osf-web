import { classNames } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { next } from '@ember/runloop';
import defaultTo from 'ember-osf-web/utils/default-to';
import eatArgs from 'ember-osf-web/utils/eat-args';

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
 *     fileText=fileText
 *     save=(action 'save')}}
 * ```
 * @class file-editor
 */

@classNames('FileEditor')
export default class FileEditor extends Component {
    fileText: string = defaultTo(this.fileText, '');
    unsavedText: string = defaultTo(this.unsavedText, '');

    @computed('fileText')
    get newText(): string {
        return String(this.fileText);
    }

    /**
     * Placeholder for closure action: save
     */
    save(text: string): void {
        eatArgs(text);
        assert('You should pass in a closure action: save');
    }

    @action
    valueUpdated(this: FileEditor, newValue): void {
        this.set('unsavedText', newValue);
    }

    @action
    revertText(this: FileEditor): void {
        const { fileText } = this;
        this.set('fileText', '');
        // Restore original text in next tick of the run loop to trigger re-render of ember-ace
        next(this, () => this.set('fileText', fileText));
    }

    @action
    saveText(): void {
        this.save(this.unsavedText);
    }
}
