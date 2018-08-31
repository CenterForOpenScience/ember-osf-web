import { classNames } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';

import Analytics from 'ember-osf-web/services/analytics';
import styles from './styles';
import layout from './template';

@classNames('input-group')
export default class CopyableText extends Component {
    // Required arguments
    text!: string;

    // Optional arguments
    analyticsLabel?: string;
    success?: () => void;
    error?: () => void;

    // Private properties
    @service analytics!: Analytics;
    layout = layout;
    styles = styles;

    hasCopied: boolean = false;

    @action
    _success() {
        this.set('hasCopied', true);
        if (this.analyticsLabel) {
            this.analytics.click('button', this.analyticsLabel);
        }
        if (this.success) {
            this.success();
        }
    }

    @action
    _error() {
        this.set('hasCopied', false);
        if (this.error) {
            this.error();
        }
    }
}
