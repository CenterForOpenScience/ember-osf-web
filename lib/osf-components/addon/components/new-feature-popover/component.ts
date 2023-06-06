import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import Cookies from 'ember-cookies/services/cookies';
import moment from 'moment';
import { tracked } from '@glimmer/tracking';

interface Args {
    triggerElement: string;
    featureCookie: string;
}

export default class NewFeaturePopover extends Component<Args> {
    @service cookies!: Cookies;
    @tracked notAgain = false;
    @tracked shouldShow = true;

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        if (this.cookies.exists(this.args.featureCookie)){
            this.shouldShow = false;
        }
    }

    @action
    onAccept() {
        if (this.notAgain) {
            this.cookies.write(this.args.featureCookie, 1, {
                expires: moment().add(10, 'years').toDate(),
                path: '/',
            });
        }
    }

    @action
    updateHelp() {
        const searchHelp = document.querySelector('[data-test-search-help]') as HTMLElement;
        const active = document.querySelectorAll('.visible');
        const firstHelp = document.querySelector('[data-test-help-1]');
        const secondHelp = document.querySelector('[data-test-help-2]');
        const thirdHelp = document.querySelector('[data-test-help-3]');
        const submitButton = document.getElementsByName('helpNextButton')[0];
        const el1 = document.querySelector('[data-test-topbar-object-type-link="All"]') as HTMLElement;
        const el2 = document.querySelector('[data-test-filter-facet-toggle="Funder"]');
        const posX1 = el1?.getBoundingClientRect().x;
        const posY1 = el1?.getBoundingClientRect().y;
        const posX2 = el2?.getBoundingClientRect().x;
        const posY2 = el2?.getBoundingClientRect().y;
        const firstLocationX = Math.floor(posX1) + 'px';
        const firstLocationY = Math.floor(posY1) + 'px';
        const secondLocationX = Math.floor(posX2) + 'px';
        const secondLocationY = Math.floor(posY2) + 'px';
        const tempX2 = `calc(${secondLocationX} + 21vw)`;
        const tempY2 = `calc(${secondLocationY} - 1vh)`;

        for (const el of active) {
            const nextSib = el?.nextElementSibling as HTMLElement;
            if (active && nextSib) {
                nextSib?.classList.replace('hidden', 'visible');
                el?.classList.replace('visible', 'hidden');
            }
            if (firstHelp?.classList.contains('visible')) {
                searchHelp.style.position = 'absolute';
                searchHelp.style.left = String(firstLocationX);
                searchHelp.style.top = String(firstLocationY);
            }
            if (secondHelp?.classList.contains('visible')) {
                searchHelp.style.position = 'absolute';
                searchHelp.style.left = tempX2;
                searchHelp.style.top = tempY2;
            }
            if (thirdHelp?.classList.contains('visible')) {
                searchHelp.style.top = '25rem';
                submitButton.textContent = 'Done';
                submitButton.addEventListener('click', () => {
                    this.dismissHelp();
                });
            }
        }
    }

    @action
    dismissHelp() {
        const searchHelp = document.querySelector('[data-test-search-help]') as HTMLElement;
        if (searchHelp) {
            searchHelp.style.display = 'none';
        }
    }
}
