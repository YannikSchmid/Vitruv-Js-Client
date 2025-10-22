import { EObject, ViewType, VitruvClient } from "../src";

describe("VitruvViewType", () => {
    const client = new VitruvClient("http://localhost:8000");
    const viewType = new ViewType("view-type-1", client);

    it("should fetch selectors for a view type", async () => {
        VitruvClient.prototype._getViewTypeSelectors = jest
            .fn()
            .mockResolvedValue({
                selectorId: "selector-1",
                selectableObjects: mockSelectableObjects,
            });

        const selectors = await viewType.getSelectors();

        expect(selectors).toBeDefined();
        expect(selectors.getId()).toBe("selector-1");
        expect(selectors.getSelectableObjects()).toEqual(mockSelectableObjects);
    });
});

export const mockSelectableObjects: EObject[] = [
    {
        eClass: "http://vitruv.tools/methodologisttemplate/model#//Component",
        _id: "id1",
    },
    {
        eClass: "http://vitruv.tools/methodologisttemplate/model#//System",
        _id: "id2",
    },
];
