import Ember from 'ember';

import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { or } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import calculatePosition from 'ember-basic-dropdown/utils/calculate-position';
import Media from 'ember-responsive';

import { layout } from 'ember-osf-web/decorators/component';

import styles from './styles';
import template from './template';

@layout(template, styles)
export default class ResponsiveDropdown extends Component {
    @service media!: Media;

    @or('media.isMobile', 'media.isTablet') useOverlay!: boolean;

    // eslint-disable-next-line ember/no-ember-testing-in-module-scope
    inTestMode = Ember.testing;
    renderInPlace = false;
    horizontalPosition = 'right';
    verticalPosition = 'below';

    @computed('inTestMode', 'useOverlay', 'renderInPlace')
    get shouldRenderInPlace() {
        // Always renderInPlace in tests
        // Don't renderInPlace on mobile (since we use modal)
        return this.inTestMode || (this.renderInPlace && !this.useOverlay);
    }

    @action
    closeDropdown(this: ResponsiveDropdown, onClose?: () => boolean): boolean {
        // Enable scroll in case a modal was used
        const bodyCls = document.querySelector('body')!.classList;
        if (bodyCls.contains('modal-open')) {
            bodyCls.remove('modal-open');
        }
        if (onClose) {
            return onClose();
        }
        return true;
    }

    @action
    calculatePosition(...args: any[]): object {
        // On Desktop
        const pos = calculatePosition(...args);
        if (!this.useOverlay) {
            return pos;
        }

        // Prevent body scroll when modal is open
        document.querySelector('body')!.classList.add('modal-open');

        return {
            horizontalPosition: null,
            verticalPosition: null,
        };
    }
}
