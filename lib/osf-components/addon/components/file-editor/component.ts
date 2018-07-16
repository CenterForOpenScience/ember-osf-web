import { classNames } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import Component from '@ember/component';
import { next } from '@ember/runloop';

import requiredAction from 'ember-osf-web/decorators/required-action';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
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
 *     fileText=fileText
 *     save=(action 'save')}}
 * ```
 * @class file-editor
 */

@classNames('FileEditor')
export default class FileEditor extends Component {
    layout = layout;
    styles = styles;

    fileText: string = defaultTo(this.fileText, '');
    unsavedText: string = defaultTo(this.unsavedText, '');
    @requiredAction save!: (text: string) => void;

    @computed('fileText')
    get newText(): string {
        return String(this.fileText);
    }

    @action
    valueUpdated(this: FileEditor, newValue: string): void {
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
