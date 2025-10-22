import { VitruvClient } from "./client";
import { Selector } from "./selector";

export class ViewType {
    constructor(private id: string, private client: VitruvClient) {}

    getId(): string {
        return this.id;
    }

    async getSelectors(): Promise<Selector> {
        const selectorResponse = await this.client._getViewTypeSelectors(
            this.id
        );
        return new Selector(
            selectorResponse.selectorId,
            selectorResponse.selectableObjects,
            this.client
        );
    }

    public toString() {
        return `${this.id} (View type)`;
    }
}
