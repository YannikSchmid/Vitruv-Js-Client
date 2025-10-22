import { EObject, EResource } from "./types";
import { ViewType } from "./view-type";

export class VitruvClient {
    constructor(private url: string) {}

    private buildUrl(endpoint: string): string {
        return `${this.url}/${endpoint}`;
    }

    getUrl(): string {
        return this.url;
    }

    async getViewTypes(): Promise<ViewType[]> {
        const ids = await this._getViewTypes();
        return ids.map((id) => new ViewType(id, this));
    }

    async isHealthy(): Promise<boolean> {
        return (await fetch(this.buildUrl("health"))).status === 200;
    }

    async _isViewClosed(viewId: string): Promise<boolean> {
        const res = await fetch(this.buildUrl("vsum/view/closed"), {
            headers: { "View-UUID": viewId },
        });
        if (res.status === 404) throw new Error("View not found");
        return (await res.json()) as boolean;
    }

    async _isViewOutdated(viewId: string): Promise<boolean> {
        const res = await fetch(this.buildUrl("vsum/view/outdated"), {
            headers: { "View-UUID": viewId },
        });
        if (res.status === 404) throw new Error("View not found");
        return (await res.json()) as boolean;
    }

    async _openView(
        selectorId: string,
        toSelectIds: string[]
    ): Promise<{ viewId: string; resourceSet: EResource[] }> {
        const res = await fetch(this.buildUrl("vsum/view"), {
            method: "POST",
            headers: { "Selector-UUID": selectorId },
            body: JSON.stringify(toSelectIds),
        });
        if (res.status === 404) throw new Error("Selector not found");
        if (res.status !== 200)
            throw new Error("Error opening view: " + (await res.text()));
        const viewId = res.headers.get("View-UUID");
        if (!viewId) throw new Error("View UUID not found in response headers");
        return {
            viewId,
            resourceSet: await res.json(),
        };
    }

    async _closeView(viewId: string) {
        const res = await fetch(this.buildUrl("vsum/view"), {
            method: "DELETE",
            headers: { "View-UUID": viewId },
        });
        if (res.status === 404) throw new Error("View not found");
    }

    async _updateView(viewId: string) {
        const res = await fetch(this.buildUrl("vsum/view"), {
            headers: { "View-UUID": viewId },
        });
        if (res.status === 404) throw new Error("View not found");
        return (await res.json()).resources as EResource[];
    }

    async _getViewTypes(): Promise<string[]> {
        const res = await fetch(this.buildUrl("vsum/view/types"));
        return res.json();
    }

    async _getViewTypeSelectors(
        viewTypeId: string
    ): Promise<{ selectorId: string; selectableObjects: EObject[] }> {
        const res = await fetch(this.buildUrl("vsum/view/selectors"), {
            headers: { "View-Type": viewTypeId },
        });
        if (res.status === 404) throw new Error("View type not found");
        const selectorId = res.headers.get("Selector-UUID");
        if (!selectorId)
            throw new Error("Selector UUID not found in response headers");
        return {
            selectorId,
            selectableObjects: await res.json(),
        };
    }

    async _commitDerivedChanges(
        viewId: string,
        resourceSet: EResource[]
    ): Promise<EResource[]> {
        const res = await fetch(this.buildUrl("vsum/view/derive-changes"), {
            method: "PATCH",
            headers: { "View-UUID": viewId },
            body: JSON.stringify(resourceSet),
        });
        if (res.status === 404) throw new Error("View not found");
        if (res.status !== 200)
            throw new Error("Error committing changes: " + (await res.text()));
        return (await res.json()) as EResource[];
    }
}
