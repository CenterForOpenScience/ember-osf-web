import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';

import { layout } from 'ember-osf-web/decorators/component';
import CarouselItem from 'osf-components/components/carousel/x-item/component';

import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
<<<<<<< HEAD
import Toast from 'ember-toastr/services/toast';
=======
>>>>>>> 25f9da9c7 (removed unnecessary styling, removed handlebars mobile queries, made dotnav buttons fully focusable, moved addLiveRegion code to separate branch, improved error message, removed unnecessary console log statements, updated tabindex to relevant elements.)

import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class Carousel extends Component {
    @service intl!: Intl;
<<<<<<< HEAD
    @service toast!: Toast;

=======
>>>>>>> 25f9da9c7 (removed unnecessary styling, removed handlebars mobile queries, made dotnav buttons fully focusable, moved addLiveRegion code to separate branch, improved error message, removed unnecessary console log statements, updated tabindex to relevant elements.)
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

<<<<<<< HEAD
    // @action
    setUpLiveRegion(message: string) {
        const w = window || null;
        const document = w.document;
        console.log(document);
        const carousel = document.getElementById('carouselInner');
        const liveregion = document.createElement('div');
        liveregion.setAttribute('arialive', 'polite');
        liveregion.setAttribute('ariaatomic', 'true');
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

    //@action
    const speech = {
        wrap: <HTMLElement>document.getElementById('swrap'),
        btn: <HTMLElement>document.getElementById('sbtn'),
        recog: null,
        init: () => {
            this.speech.wrap = <HTMLElement>document.getElementById('swrap');
            this.speech.btn = <HTMLElement>document.getElementById('sbtn');

            // get mic permission
            navigator.mediaDevices.getUserMedia({ audio: true}).then((stream) => {
                const speech = SpeechRecognition || webkitSpeechRecognition;
                this.speech.recog = new SpeechRecognition();
                speech.recog.lang = 'en-US';
                speech.recog.continuous = false;
                speech.interimResults = false;

                speech.recog.onresult = (evt: any) => {
                    let said = evt.results[0][0].transcript.toLowerCase();
                    if cmd([said]) { cmd[said]
                    else { said += " (command not found)"; }
                    speech.wrap.innerHTML = said;
                    speech.stop();

                }
                speech.recog.onerror = (err: string) => { this.toast.error(err)};
                
                speech.btn.disabled = false;
                speech.stop();

            }).catch((err) => {
                console.log(err);
                this.speech.wrap.innerHTML = 'Microphone access required for voice navigation.';
            });
        },

        start: () => {
            speech.recog.start()
            speech.btn.onclick = speech.stop;
            speech.btn.value = 'click or press Enter to speak selections';
        }

        stop: () => {
            speech.onclick() = speech.start();
            speech.btn.value = 'press to speak selections'
        }
    } 


=======
>>>>>>> 25f9da9c7 (removed unnecessary styling, removed handlebars mobile queries, made dotnav buttons fully focusable, moved addLiveRegion code to separate branch, improved error message, removed unnecessary console log statements, updated tabindex to relevant elements.)
    /** registerKeyboard() is a function that enables users to navigate certain
     *  components with a keyboard rather than using a mouse. The keybindings are
     *  designed for optimal ergonomic comfort as well as improving overall user
     *  experience while within the application.
     *
     *  @author : chthonix
     *  @date : Sat Oct 01 2022 14:26:06 GMT-0400
     */
    registerKeyboard() {
<<<<<<< HEAD
        // set up voice over
        let msg = 'Keyboard navigation enabled. Press lower case h to hear more.';
        // this.setUpLiveRegion(msg);
        console.log('voice over set to: ', msg);
        

=======
>>>>>>> 25f9da9c7 (removed unnecessary styling, removed handlebars mobile queries, made dotnav buttons fully focusable, moved addLiveRegion code to separate branch, improved error message, removed unnecessary console log statements, updated tabindex to relevant elements.)
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
<<<<<<< HEAD

=======
>>>>>>> 25f9da9c7 (removed unnecessary styling, removed handlebars mobile queries, made dotnav buttons fully focusable, moved addLiveRegion code to separate branch, improved error message, removed unnecessary console log statements, updated tabindex to relevant elements.)
            // do not override native browser or SR controls
            if (name === 'Control' || name === 'Meta') {
                return;
            }

            // switch operand based on user input
            // current wirings are for left, right and dot slide navigation
<<<<<<< HEAD
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
=======
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
>>>>>>> 25f9da9c7 (removed unnecessary styling, removed handlebars mobile queries, made dotnav buttons fully focusable, moved addLiveRegion code to separate branch, improved error message, removed unnecessary console log statements, updated tabindex to relevant elements.)
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
<<<<<<< HEAD
                } else {
                    w.toastr.error(this.intl.t('osf-components.carousel.dot_nav_error_message'));
                }

            } catch(e) {
                w.toastr.error(this.intl.t('osf-components.carousel.key_name_and_code'));
            }
        }, true);
=======
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
>>>>>>> 25f9da9c7 (removed unnecessary styling, removed handlebars mobile queries, made dotnav buttons fully focusable, moved addLiveRegion code to separate branch, improved error message, removed unnecessary console log statements, updated tabindex to relevant elements.)
    }
}
