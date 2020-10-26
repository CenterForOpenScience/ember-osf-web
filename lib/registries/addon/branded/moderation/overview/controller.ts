import OverviewController from 'registries/overview/controller';

export default class BrandedModerationOverviewController extends OverviewController {
    mode = 'moderator';
    analyticsScope = 'Registries Moderation Overview';
}
