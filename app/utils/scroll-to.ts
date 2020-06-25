import Ember from 'ember';

export function scrollTo(element: HTMLElement) {
    const position = element.getBoundingClientRect().top + window.scrollY;
    if (!Ember.testing) {
        element.scrollIntoView();
    } else {
        const testContainer = element.closest('#ember-testing-container');
        if (testContainer) {
            testContainer.scrollTop = position;
        }
    }
}
