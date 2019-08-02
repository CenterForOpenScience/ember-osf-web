import { classNames } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { timeout } from 'ember-concurrency';

import { layout } from 'ember-osf-web/decorators/component';
import Analytics from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import template from './template';

@layout(template, styles)
@classNames('input-group')
export default class CopyableText extends Component {
    // Required arguments
    text!: string;

    // Optional arguments
    analyticsLabel?: string;
    success?: () => void;
    error?: () => void;
    disabled: boolean = defaultTo(this.disabled, false);

    // Private properties
    @service analytics!: Analytics;

    showTooltip: boolean = false;

    @action
    async _success() {
        if (this.analyticsLabel) {
            this.analytics.click('button', this.analyticsLabel);
        } else {
            this.analytics.trackFromElement(this.element, {
                name: 'Copy text',
                category: 'button',
                action: 'click',
            });
        }
        if (this.success) {
            this.success();
        }
        this.set('showTooltip', true);
        await timeout(3000);
        this.set('showTooltip', false);
    }

    @action
    _error() {
        this.set('showTooltip', false);
        if (this.error) {
            this.error();
        }
    }
}
