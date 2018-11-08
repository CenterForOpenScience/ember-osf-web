interface Owner {
    application: {
        rootElement: string;
    };
}

function getRootElement({ application: { rootElement: rootElementSelector } }: Owner): HTMLElement {
    return document.querySelector(rootElementSelector) as HTMLElement;
}

// Helper to avoid throwing QUnit's test window around
export default function(owner: Owner, offsetOrElement: HTMLElement | number) {
    let offset: number;
    const root = getRootElement(owner);

    if (offsetOrElement instanceof HTMLElement) {
        offset = offsetOrElement.getBoundingClientRect().top;
    } else {
        offset = offsetOrElement;
    }

    root.parentElement!.scrollTop = offset;
}
