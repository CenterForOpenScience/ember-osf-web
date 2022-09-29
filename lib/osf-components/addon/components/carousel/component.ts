/* eslint-disable no-console */
import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';

import { layout } from 'ember-osf-web/decorators/component';
import CarouselItem from 'osf-components/components/carousel/x-item/component';

import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';

import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class Carousel extends Component {
    @service intl!: Intl;
    // Private properties
    carouselItems: CarouselItem[] = [];

    @computed('carouselItems.{length,@each.isActive}')
    get activeSlide() {
        return this.carouselItems.findBy('isActive');
    }

    @action
    register(item: CarouselItem) {
        this.carouselItems.pushObject(item);
    }

    @action
    changeSlide(direction: string) {
        const activeSlide = this.carouselItems.findBy('isActive');
        const activeIndex = activeSlide!.index;
        let newIndex = direction === 'previous' ? activeIndex - 1 : activeIndex + 1;

        if (newIndex > this.carouselItems.length - 1) {
            newIndex = 0;
        } else if (newIndex < 0) {
            newIndex = this.carouselItems.length - 1;
        }

        this.carouselItems[activeIndex].set('isActive', false);
        this.carouselItems[newIndex].set('isActive', true);
    }

    @action
    navClick(item: CarouselItem) {
        const activeSlide = this.carouselItems.findBy('isActive');
        const activeIndex = activeSlide!.index;
        const newIndex = item.index;

        this.carouselItems[activeIndex].set('isActive', false);
        this.carouselItems[newIndex].set('isActive', true);
    }

    /** registerKeyboard() is a function that enables users to navigate certain
     *  components with a keyboard rather than using a mouse. The keybindings are
     *  designed for optimal ergonomic comfort as well as improving overall user
     *  experience while within the application.
     */
    registerKeyboard() {
        // locate elements
        const dotNav = document.getElementById('dotNav');
        const leftNav = document.getElementById('leftNav');
        const rightNav = document.getElementById('rightNav');

        // set up event listener for keyboard input
        document.addEventListener('keydown', event => {
            const name = event.key;
            const code = event.code;
            // do not override native browser or SR controls
            if (name === 'Control' || name === 'Meta') {
                return;
            }

            // switch operand based on user input
            // current wirings are for left, right and dot slide navigation
            if (event.ctrlKey) {
                switch(name) {
                case('f'):
                    console.log('navigating to previous slide.');
                    if (leftNav) {
                        leftNav.click();
                    }
                    break;
                case('j'):
                    console.log('navigating to next slide.');
                    if (rightNav) {
                        rightNav.click();
                    }
                    break;
                case('d'):
                    console.log('inside carousel dot navigation.');
                    if (dotNav) {
                        dotNav.focus();
                    }
                    break;
                // TODO re-add registerKeyboard()
                // case('k'):
                    // re-open keyboard menu
                default:
                    throw new Error(this.intl.t('osf-components.carousel.keyboard_error_message'));
                    break;
                }
            } else {
                console.log(`Other key registered: \n\tname ${name} \nt code: ${code}`);
            }
        }, true);

        if (dotNav) {
            const buttonElements = dotNav.children;
            const buttonOne = document.querySelectorAll("['data-test-navigation-button']")[0];
            const buttonTwo : Element = buttonElements[1].children[0] || null;
            const buttonThree : Element = buttonElements[2].children[0] || null;

            document.addEventListener('keyup', event => {
                if (event.code === '49') {
                    if (buttonOne) {
                        buttonOne.classList.add('active'); // TODO test
                    }
                }
                if (event.code === '50') {
                    if (buttonTwo) {
                        buttonTwo.classList.add('active');
                    }
                }
                if (event.code === '51') {
                    if (buttonThree) {
                        buttonThree.classList.add('active');
                    }
                }
            });
        }
    }
}
