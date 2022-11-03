import Controller from '@ember/controller';
import { alias, bool } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { camelize } from '@ember/string';
import { tracked } from '@glimmer/tracking';
import Features from 'ember-feature-flags/services/features';
import config from 'ember-get-config';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

const { featureFlagNames: { ABTesting } } = config;

export default class Home extends Controller {
    @service features!: Features;
    @service intl!: Intl;
    @service toast!: Toast;

    @alias(`features.${camelize(ABTesting.homePageHeroTextVersionB)}`)
    shouldShowVersionB!: boolean;

    @tracked keyboardActive = false;

    @bool('currentUser.currentUserId') isLoggedIn?: boolean;

    menuItems: string[] = ['OSF Products', 'Sign in', 'Sign up', 'Main Content', 'Search the OSF',
        'OSF Support', 'Donate', 'Learn more about the OSF', 'OSF Testimonials' , 'Integrations and add-ons.'];

    registerKeyboard() {
        const OSFProductDropdownCaret : HTMLElement | null = document.querySelector('[data-test-service-dropdown]');
        const OSFHome: Element | null = document.querySelectorAll("[data-analytics-name='HOME']")[1];
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

        document.addEventListener('scroll', () => {
            const menu = document.getElementById('menu');

            if (menu) {
                const sticky = menu.offsetTop;
                if (window.pageYOffset >= sticky) {
                    menu.classList.add('sticky');
                } else {
                    menu.classList.add('sticky');
                }
            }
        });

        document.addEventListener('keydown', event => {
            const name = event.key;

            // avoid overriding native browser or SR controls
            if (name === 'Control' || name === 'Meta') {
                return;
            }

            if (event.altKey) {
                event.preventDefault();
                switch(name) {
                // 'Alt' + '1'
                case('¡'):
                    if (OSFProductDropdownCaret) {
                        OSFProductDropdownCaret.click();
                    }
                    if (OSFHome) {
                        OSFHome.classList.add('active');
                    }
                    break;
                // 'Alt' + '2'
                case('™'):
                    if (signInButton) {
                        signInButton.click();
                    }
                    break;
                // 'Alt' + '3'
                case('£'):
                    if (signUpButton) {
                        signUpButton.click();
                    }
                    break;
                // 'Alt' + '4'
                case('¢'):
                    if (mainContent) {
                        mainContent.click();
                    }
                    break;
                // 'Alt' + '5'
                case('∞'):
                    if (searchInput) {
                        searchInput.focus();
                    }
                    break;
                // 'Alt' + '6'
                case('§'):
                    if (supportButton) {
                        supportButton.click();
                    }
                    break;
                // 'Alt' + '7'
                case('¶'):
                    if (donateButton) {
                        donateButton.click();
                    }
                    break;
                // 'Alt' +  '8'
                case('•'):
                    if (learnMoreButton) {
                        learnMoreButton.click();
                    }
                    break;
                // 'Alt' + '9'
                case('ª'):
                    if (testimonials) {
                        testimonials.click();
                    }
                    try {
                        if (testimonialsCarousel) {
                            testimonialsCarousel.focus();
                        }
                    } catch (e) {
                        this.toast.error(this.intl.t('new-home.voice-over.keyboard_not_activated'));
                    }
                    break;
                // 'Alt' + '0'
                case('º'):
                    if (integrations) {
                        integrations.click();
                    }
                    try {
                        if (integrations) {
                            integrations.focus();
                        }
                    } catch (e) {
                        this.toast.error(this.intl.t('new-home.voice-over.keyboard_not_activated'));
                    }
                    break;
                default:
                    break;
                }
            } else {
                this.toast.error(this.intl.t('new-home.voice-over.other_key_press'));
            }
        }, true);
    }
}

declare module '@ember/controller' {
    interface Registry {
        home: Home;
    }
}
