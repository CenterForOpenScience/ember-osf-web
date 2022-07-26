import { ResourceTypes } from 'ember-osf-web/models/resource';

export function getBadgeIcon(resourceType: ResourceTypes) {
    switch (resourceType) {
    case ResourceTypes.Data:
        return '/assets/images/badges/data_small_color.png';
    case ResourceTypes.Materials:
        return '/assets/images/badges/materials_small_color.png';
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
    default:
        return '/assets/images/badges/data_small_gray.png';
    }
}
