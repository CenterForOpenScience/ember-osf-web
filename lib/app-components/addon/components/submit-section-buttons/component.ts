import { classNames } from '@ember-decorators/component';
import Component from '@ember/component';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import styles from './styles';
import template from './template';

@layout(template, styles)
@classNames('col-xs-12 text-right')
export default class SubmitSectionButtons extends Component {
    showDiscard: boolean = true;
    continueDisabled: boolean = false;

    @requiredAction discard!: () => void;
    @requiredAction continue!: () => void;
}
