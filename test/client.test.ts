import { VitruvClient } from "../src/client";

describe("VitruvClient", () => {
    const url = "http://localhost:8000";
    const mockViewTypes = ["view-type-1", "view-type-2"];
    let client: VitruvClient;

    beforeEach(() => {
        client = new VitruvClient(url);
    });

    it("should create a client with the correct url", () => {
        expect(client).toBeDefined();
        expect(client.getUrl()).toEqual(url);
    });

    it("should fetch view types", async () => {
        VitruvClient.prototype._getViewTypes = jest
            .fn()
            .mockResolvedValue(mockViewTypes);

        const viewTypes = await client.getViewTypes();

        expect(viewTypes.length).toBe(2);
        expect(viewTypes[0].getId()).toBe(mockViewTypes[0]);
        expect(viewTypes[1].getId()).toBe(mockViewTypes[1]);
    });
});
