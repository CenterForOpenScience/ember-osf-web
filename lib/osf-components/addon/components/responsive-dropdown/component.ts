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

        const [, content] = args;
        content.style.position = 'fixed';
        content.style.top = '50%'; // move top of div to center of screen
        content.style.left = '50%'; // move left of div to center of screen
        content.style.transform = 'translate(-50%, -50%)'; // move div to top-left by -50% of its own height/width
        content.style.right = '';
        content.style.bottom = '';
        content.style.maxHeight = '90%';
        content.style.maxWidth = '90%';
        content.style.overflow = 'auto';

        return {
            horizontalPosition: null,
            verticalPosition: null,
        };
    }
}
