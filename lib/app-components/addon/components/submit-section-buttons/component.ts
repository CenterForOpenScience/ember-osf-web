import { classNames } from '@ember-decorators/component';
import Component from '@ember/component';
import { requiredAction } from 'ember-osf-web/decorators/component';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import layout from './template';

@classNames('col-xs-12 text-right')
export default class SubmitSectionButtons extends Component {
    layout = layout;
    styles = styles;

    showDiscard: boolean = defaultTo(this.showDiscard, true);
    continueDisabled: boolean = defaultTo(this.continueDisabled, false);

    @requiredAction discard!: () => void;
    @requiredAction continue!: () => void;
}
