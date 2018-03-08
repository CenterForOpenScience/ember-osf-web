import Component from '@ember/component';

export default class QuickfileNav extends Component.extend({
    tagName: 'nav',

    classNames: ['row'],

    attributeBindings: ['role'],

    role: 'navigation',
}) {}
