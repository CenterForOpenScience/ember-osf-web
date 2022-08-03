import { ResourceTypes } from 'ember-osf-web/models/resource';

export function getBadgeIcon(resourceType: ResourceTypes) {
    switch (resourceType) {
    case ResourceTypes.Data:
        return '/assets/images/badges/data_small_color.png';
    case ResourceTypes.Materials:
        return '/assets/images/badges/materials_small_color.png';
    case ResourceTypes.AnalyticCode:
        return '/assets/images/badges/analytic_code_small_color.png';
    case ResourceTypes.Papers:
        return '/assets/images/badges/papers_small_color.png';
    case ResourceTypes.Supplements:
        return '/assets/images/badges/supplements_small_color.png';
    default:
        return '/assets/images/badges/data_small_color.png';
    }
}

export function getBadgeIconDisabled(resourceType: ResourceTypes) {
    switch (resourceType) {
    case ResourceTypes.Data:
        return '/assets/images/badges/data_small_gray.png';
    case ResourceTypes.Materials:
        return '/assets/images/badges/materials_small_gray.png';
    case ResourceTypes.AnalyticCode:
        return '/assets/images/badges/analytic_code_small_gray.png';
    case ResourceTypes.Papers:
        return '/assets/images/badges/papers_small_gray.png';
    case ResourceTypes.Supplements:
        return '/assets/images/badges/supplements_small_gray.png';
    default:
        return '/assets/images/badges/data_small_gray.png';
    }
}
