import Route from '@ember/routing/route';

export default class BrandedModerationIndexRoute extends Route {
    beforeModel() {
        this.replaceWith('branded.moderation.submissions');
    }
}
