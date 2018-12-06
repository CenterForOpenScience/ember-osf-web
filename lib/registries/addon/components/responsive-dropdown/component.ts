import Ember from 'ember';

import { action } from '@ember-decorators/object';
import { not } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import calculatePosition from 'ember-basic-dropdown/utils/calculate-position';
import Media from 'ember-responsive';

export default class ResponsiveDropdown extends Component {
    @service media!: Media;

    @not('media.isDesktop') useOverlay!: boolean;

    inTestMode: boolean = Ember.testing;

    @action
    closeDropdown(this: ResponsiveDropdown): void {
        // Enable scroll in case a modal was used
        const bodyCls = document.querySelector('body')!.classList;
        if (bodyCls.contains('modal-open')) {
            bodyCls.remove('modal-open');
        }
    }

    @action
    calculatePosition(this: ResponsiveDropdown, ...args: any[]): object {
        // On Desktop
        if (!this.useOverlay) {
            const pos = calculatePosition(...args);
            if (pos && pos.style) {
                pos.style.top += 10;
            }
            return pos;
        }

        // Prevent body scroll when modal is open
        document.querySelector('body')!.classList.add('modal-open');

        const [, content] = args;
        const { height: dropdownHeight, width: dropdownWidth } = content.getBoundingClientRect();
        content.style.marginLeft = `${-(dropdownWidth / 2)}px`;
        content.style.marginTop = `${-(dropdownHeight / 2)}px`;
        content.style.top = '50%';
        content.style.left = '50%';
        content.style.right = '';

        return {
            horizontalPosition: null,
            verticalPosition: null,
        };
    }
}
