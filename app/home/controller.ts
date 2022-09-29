/* eslint-disable no-console*/
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable prefer-const */
import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { camelize } from '@ember/string';
import { tracked } from '@glimmer/tracking';
import Features from 'ember-feature-flags/services/features';
import config from 'ember-get-config';
import Intl from 'ember-intl/services/intl';

const { featureFlagNames: { ABTesting } } = config;

export default class Home extends Controller {
    @service features!: Features;
    @service intl!: Intl;

    @alias(`features.${camelize(ABTesting.homePageHeroTextVersionB)}`)
    shouldShowVersionB!: boolean;

    @tracked keyboardActive = false;
    menuItems: string[] = ['OSF Products', 'Sign in', 'Sign up', 'Main Content', 'Search the OSF',
        'OSF Support', 'Donate', 'Learn more about the OSF', 'OSF Testimonials' , 'Integrations and add-ons.'];

    setUpLiveRegion(message: string) {
        const w = window || null;
        const document = w.document;

        // set liveregion currently to the menu
        const menu = document.getElementById('menu');
        const liveregion = document.createElement('div');
        if (liveregion) {
            liveregion.setAttribute('aria-live', 'polite');
            liveregion.setAttribute('aria-atomic', 'true');
            liveregion.setAttribute('local-class', 'live-region visually-hidden');
            liveregion.setAttribute('tabindex', '0');
            liveregion.setAttribute('id', 'liveRegion');
        }
        let subject = 'You';
        let predicate = message;
        let msg: string = subject + predicate;
        const data = document.createTextNode(msg);
        console.log('Spoken: ', msg);
        liveregion.appendChild(data);
        if (menu && liveregion) {
            menu.insertAdjacentElement('beforebegin', liveregion);
        }
    }

    registerKeyboard() {
        const OSFProductDropdownCaret : HTMLElement | null = document.querySelector('[data-test-service-dropdown]');
        const OSFHOME: Element | null = document.querySelectorAll("[data-analytics-name='HOME']")[1];
        const signInButton: HTMLElement | null = document.querySelector('[data-test-sign-in-button]');
        const signUpButton: HTMLElement | null = document.querySelector('[data-test-ad-sign-up-button]');
        const mainContent = document.getElementById('mainContentLink');
        const searchInput = document.getElementsByName('search')[0];
        const supportButton: HTMLElement | null= document.querySelector('[data-analytics-name="Support"]');
        const donateButton: HTMLElement | null = document.querySelector('[data-analytics-name="Donate"]');
        const learnMoreButton: HTMLElement | null = document.querySelector('[data-test-get-started-button]');
        const testimonials: HTMLElement | null = document.querySelector('[data-test-carousel-container]');
        const testimonialsCarousel: HTMLElement | null = document.querySelector('[data-test-carousel-container]');
        const integrations: HTMLElement | null = document.getElementById('integrationsLink');

        // if keyboard active, turn on liveregion
        // let msg = this.intl.t('new-home.voice-over.activate_keyboard_msg');
        // this.setUpLiveRegion(msg);
        // this.set('keyboardActive', true);

        document.addEventListener('keydown', event => {
            const name = event.key;
            const code = event.code;
            // do not override native browser or SR controls
            if (name === 'Control' || name === 'Meta') {
                return;
            }

            if (event.altKey) {
                event.preventDefault();
                console.log(`Combination of name + ${name} \n code: ${code}`);
                switch(name) {
                // 'Alt' + '1'
                case('¡'):
                    console.log('Opening the OSF Products navbar.');
                    // click  OSF Products dropdown caret
                    if (OSFProductDropdownCaret) {
                        OSFProductDropdownCaret.click();
                    }
                    if (OSFHOME) {
                        // focus OSFHome in dropdown
                        OSFHOME.classList.add('active');
                    }
                    break;
                // 'Alt' + '2'
                case('™'):
                    console.log('Navigating to the OSF sign in page.');
                    if (signInButton) {
                        // click on Sign in button
                        signInButton.click();
                    }
                    break;
                // 'Alt' + '3'
                case('£'):
                    console.log('Redirecting to the OSF sign up page.');
                    if (signUpButton) {
                        // click on Sign up button
                        signUpButton.click();
                    }
                    break;
                // 'Alt' + '4'
                case('¢'):
                    console.log(`Skipping to main content: 'Get started'`);
                    if (mainContent) {
                        // click main content skip link
                        mainContent.click();
                    }
                    break;
                // 'Alt' + '5'
                case('∞'):
                    console.log('Skipping to OSF Search');
                    if (searchInput) {
                        // focus OSF Search input
                        searchInput.focus();
                    }
                    break;
                // 'Alt' + '6'
                case('§'):
                    console.log('Navigating to the OSF Support page.');
                    if (supportButton) {
                        // click Support button
                        supportButton.click();
                    }
                    break;
                // 'Alt' + '7'
                case('¶'):
                    console.log('Navigating to the donation page.');
                    console.log('Thank you - Your donation helps support open science globally.');
                    if (donateButton) {
                        // click Donate button
                        donateButton.click();
                    }
                    break;
                // 'Alt' +  '8'
                case('•'):
                    console.log('Learn more about open science and how it supports the scientific community.');
                    // skip to Learn more section
                    if (learnMoreButton) {
                        learnMoreButton.click();
                    }
                    break;
                // 'Alt' + '9'
                case('ª'):
                    console.log('Skipping to OSF Testimonials.');
                    // skip to OSF Testimonials
                    if (testimonials) {
                        testimonials.click();
                    }
                    // focus Testimonials carousel
                    try {
                        if (testimonialsCarousel) {
                            testimonialsCarousel.focus();
                        }
                    } catch (e) {
                        return new Error('Keyboard for carousel not activated.');
                    }
                    break;
                // 'Alt' + '0'
                case('º'):
                    console.log('Discover available third-party integrations and add-ons with the OSF.');
                    // click skip link for integrations
                    if (integrations) {
                        integrations.click();
                    }
                    // TODO focus first integration
                    break;
                default:
                    console.log('You have selected an unregistered menu item.');
                    console.log('Press Tab to leave this menu or try again with another option.');
                    break;
                }
            } else {
                console.log(`Other key registered: \n\tname ${name} \nt code: ${code}`);
            }
        }, true);
        // this.set('keyboardActive', false);
        // further code handling here
    }
}

declare module '@ember/controller' {
    interface Registry {
        home: Home;
    }
}
