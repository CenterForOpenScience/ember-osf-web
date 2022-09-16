/* eslint-disable no-console */
import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';

import { layout } from 'ember-osf-web/decorators/component';
import CarouselItem from 'osf-components/components/carousel/x-item/component';

import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class Carousel extends Component {
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

    setUpLiveRegion(message: string) {
        const w = window || null;
        const document = w.document;
        console.log(document);
        const carousel = document.getElementById('carouselInner');
        const liveregion = document.createElement('div');
        liveregion.setAttribute('aria-live', 'polite');
        liveregion.setAttribute('aria-atomic', 'true');
        liveregion.setAttribute('class', 'liveregion visuallyhidden');
        if (carousel && liveregion) {
            let subject = 'You';
            let msg: string = subject + message;
            const data = document.createTextNode(msg);
            console.log('Spoken: ', msg);
            liveregion.appendChild(data);
            carousel.appendChild(liveregion);
        }
    }

    /** registerKeyboard() is a function that enables users to navigate certain
     *  components with a keyboard rather than using a mouse. The keybindings are
     *  designed for optimal ergonomic comfort as well as improving overall user
     *  experience while within the application.
     */
    registerKeyboard() {
        // set up voice over
        let msg = 'Keyboard navigation enabled. Press lower case h to hear more.';
        this.setUpLiveRegion(msg);
        console.log('voice over set to: ', msg);

        // locate elements
        const dotNav = document.getElementById('dotNav');
        const leftNav = document.getElementById('leftNav');
        const rightNav = document.getElementById('rightNav');

        // set up event listener for keyboard input
        document.addEventListener('keydown', event => {
            const name = event.key;
            const code = event.code;
            const dotNav = document.getElementById('dotNav');
            // do not override native browser or SR controls
            if (name === 'Control' || name === 'Meta') {
                return;
            }

            // bind the current this context
            let THIS = (vm=this) => console.log(vm);
            THIS();

            // switch operand based on user input
            if (event.ctrlKey) {
                console.log(`Combination of ctrlKey + ${name} \n code: ${code}`);

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
                case('h'):
                    console.log('selecting help guide.');
                    break;
                default:
                    console.log('selected an unregistered command.');
                    break;
                }
            } else {
                console.log(`Other key registered: \n\tname ${name} \nt code: ${code}`);
            }
        }, true);

        if (dotNav) {
            const buttonElements = dotNav.children;
            console.log('can select from the following elements: ', buttonElements);
            const buttonOne: Element = buttonElements[0].children[0] || null;
            const buttonTwo : Element = buttonElements[1].children[0] || null;
            const buttonThree : Element = buttonElements[2].children[0] || null;

            document.addEventListener('keyup', event => {
                const eventType = typeof(event);
                console.log('initiating event type: ', eventType);
                console.log('event code is:', event.code);
                if (event.code === '49') {
                    buttonOne.click();
                    console.log('selecting the first slide.'); // TODO update with item data
                }
                if (event.code === '50') {
                    buttonTwo.click();
                    console.log('selecting the second slide.'); // TODO update with item data
                }
                if (event.code === '51') {
                    buttonThree.click();
                    console.log('selecting the third slide.'); // TODO update with item data
                }
            });
        }

        document.addEventListener('keyup', event => {
            const name = event.key;
            if (name === 'Control') {
                console.log('Control key released.');
            }
            if (name === 'Alt') {
                console.log('Alt key released.');
            }
            if (name === 'Shift') {
                console.log('Shift key released.');
            }
        }, false);
    }
}
