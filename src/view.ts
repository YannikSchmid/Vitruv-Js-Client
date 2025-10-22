import { VitruvClient } from "./client";

export class View {
    private closed = false;
    constructor(
        private client: VitruvClient,
        private uuid: string,
        private resourceSet: any
    ) {}

    async commitChanges() {
        return this.client._commitDerivedChanges(this.uuid, this.resourceSet);
    }

    async close() {
        await this.client._closeView(this.uuid);
        this.closed = true;
    }

    getId() {
        return this.uuid;
    }

    getResourceSet() {
        return this.resourceSet;
    }

    setResourceSet(resourceSet: any) {
        this.resourceSet = resourceSet;
    }

    updateResourceSet(updateFn: (resourceSet: any) => any) {
        this.resourceSet = updateFn(this.resourceSet);
    }

    async isOutdated(): Promise<boolean> {
        if (this.closed) throw new Error("View is closed");
        return this.client._isViewOutdated(this.uuid);
    }

    async update() {
        this.resourceSet = await this.client._updateView(this.uuid);
    }

    public toString() {
        return `${this.uuid} (View)`;
    }
}
