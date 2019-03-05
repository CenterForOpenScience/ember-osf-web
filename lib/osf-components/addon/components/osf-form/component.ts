import { layout } from '@ember-decorators/component';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { requiredAction } from 'ember-osf-web/decorators/component';
import template from './template';

@layout(template)
export default class OsfForm extends Component {
    // Required arguments
    @requiredAction onSave!: () => void;
    formData?: any;

    // Private properties
    hasError: boolean = false;
    shouldShowMessages: boolean = false;

    saveFormTask = task(function *(this: OsfForm) {
        const { formData, onSave } = this;
        const { validations } = yield formData.validate();

        if (!validations.get('isValid')) {
            this.set('shouldShowMessages', true);
            return;
        }
        onSave();
    });
}
