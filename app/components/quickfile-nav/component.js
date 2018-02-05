import Component from '@ember/component';

export default Component.extend({
    tagName: 'nav',
    classNames: ['navbar', 'osf-project-navbar', 'row'],
    attributeBindings: ['role'],
    role: 'navigation',
});
