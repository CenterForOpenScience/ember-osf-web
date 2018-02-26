import Component from '@ember/component';

export default class QuickfileNav extends Component.extend({
    tagName: 'nav',

    classNames: ['navbar', 'osf-project-navbar', 'row'],

    attributeBindings: ['role'],

    role: 'navigation',
}) {}
