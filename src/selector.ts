import { VitruvClient } from "./client";
import { EObject, EResource } from "./types";
import { View } from "./view";

export class Selector {
    constructor(
        private id: string,
        private selectableObjects: EObject[],
        private client: VitruvClient
    ) {}

    /**
     * Get the UUID of this selector.
     * @returns The UUID of this selector.
     */
    getId(): string {
        return this.id;
    }

    /**
     * Get the objects that can be selected with this selector.
     * @returns An array of EObject that can be selected with this selector.
     */
    getSelectableObjects() {
        return this.selectableObjects;
    }

    /**
     * Open a view with this selector.
     * @param objectsToSelect The objects to select in the view. If not provided, all objects will be used.
     * @returns A Promise that resolves to a opened View object.
     */
    async openView(objectsToSelect?: EObject[]): Promise<View> {
        if (!objectsToSelect) objectsToSelect = this.selectableObjects;
        const viewResponse = await this.client._openView(
            this.id,
            objectsToSelect.map((r) => r._id)
        );
        return new View(
            this.client,
            viewResponse.viewId,
            viewResponse.resourceSet
        );
    }

    public toString() {
        return `${this.id} (Selector)`;
    }
}
