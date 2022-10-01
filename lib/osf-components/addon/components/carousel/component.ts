import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';

import { layout } from 'ember-osf-web/decorators/component';
import CarouselItem from 'osf-components/components/carousel/x-item/component';

import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class Carousel extends Component {
    @service intl!: Intl;
    @service toast!: Toast;

    // Private properties
    carouselItems: CarouselItem[] = [];

    constructor(...args: any[]) {
        super(...args);
        this.registerKeyboard.bind(this);
    }

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
     *
     *  @author : chthonix
     *  @date : Sat Oct 01 2022 14:26:06 GMT-0400
     */
    registerKeyboard() {
        // locate elements
        const carousel: HTMLElement = document.querySelector('[data-test-carousel-container]') as HTMLElement;
        const leftNav: HTMLElement = document.getElementById('leftNav') as HTMLElement;
        const rightNav: HTMLElement = document.getElementById('rightNav') as HTMLElement;

        const dotNav: HTMLElement = document.getElementById('dotNav') as HTMLElement;
        const buttonElements: HTMLCollection = dotNav.children;
        const buttonOne: HTMLElement = buttonElements[0].children[0] as HTMLElement;
        const buttonTwo: HTMLElement = buttonElements[1].children[0] as HTMLElement;
        const buttonThree: HTMLElement = buttonElements[2].children[0] as HTMLElement;
        const w = window;

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
            try {
                if (event.ctrlKey) {
                    event.preventDefault();
                    switch(name) {
                    // previous slide
                    case('f'):
                        if (leftNav) {
                            leftNav.click();
                        }
                        break;
                    // next slide
                    case('j'):
                        if (rightNav) {
                            rightNav.click();
                        }
                        break;
                    // dot navigation
                    case('d'):
                        if (dotNav) {
                            buttonOne.click();
                        }
                        break;
                    // re-focus carousel
                    case('r'):
                        carousel.focus();
                        break;
                    default:
                        w.toastr.error(this.intl.t('osf-components.carousel.keyboard_error_message'));
                        break;
                    }
                } else if (event.altKey) {
                    event.preventDefault();
                    if (dotNav) {
                        switch(code) {
                        // slide 1
                        case('Digit1'):
                            if (buttonOne) {
                                buttonOne.click();
                            }
                            break;
                        // slide 2
                        case('Digit2'):
                            if (buttonTwo) {
                                buttonTwo.click();
                            }
                            break;
                        // slide 3
                        case('Digit3'):
                            if (buttonThree) {
                                buttonThree.click();
                            }
                            break;
                        default:
                            w.toastr.error(this.intl.t('osf-components.carousel.slide_nav_error_message'));
                            break;
                        }
                    }
                } else {
                    w.toastr.error(this.intl.t('osf-components.carousel.dot_nav_error_message'));
                }

            } catch(e) {
                w.toastr.error(this.intl.t('osf-components.carousel.key_name_and_code'));
            }
        }, true);
    }
}
