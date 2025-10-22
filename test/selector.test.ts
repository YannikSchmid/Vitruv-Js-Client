import { Selector } from "../src/selector";
import { View } from "../src/view";
import { VitruvClient } from "../src/client";
import { EObject, EResource } from "../src/types";
import { mockSelectableObjects } from "./view-type.test";

describe("Selector", () => {
    const client = new VitruvClient("http://localhost:8000");
    const selector = new Selector("selector-1", mockSelectableObjects, client);

    it("should return the correct id", () => {
        expect(selector.getId()).toBe("selector-1");
    });

    it("should return the correct selectable objects", () => {
        expect(selector.getSelectableObjects()).toEqual(mockSelectableObjects);
    });

    it("should open a view with all selectable objects when no specific objects are provided", async () => {
        VitruvClient.prototype._openView = jest.fn().mockResolvedValue({
            viewId: "view-1",
            resourceSet: mockResourceSet,
        });

        const view = await selector.openView();

        expect(VitruvClient.prototype._openView).toHaveBeenCalledWith(
            "selector-1",
            mockSelectableObjects.map((r) => r._id)
        );
        expect(view).toBeInstanceOf(View);
        expect(view.getId()).toBe("view-1");
        expect(view.getResourceSet()).toBe(mockResourceSet);
    });

    it("should open a view with specific objects when provided", async () => {
        VitruvClient.prototype._openView = jest.fn().mockResolvedValue({
            viewId: "view-1",
            resourceSet: mockResourceSet,
        });
        const view = await selector.openView([mockSelectableObjects[0]]);

        expect(VitruvClient.prototype._openView).toHaveBeenCalledWith(
            "selector-1",
            [mockSelectableObjects[0]._id]
        );
    });

    it("should correctly update the resouce set", () => {
        const view = new View(client, "view-1", mockResourceSet);
        view.updateResourceSet((rs) => {
            rs[0].content.components[0].name = "Updated Component";
            return rs;
        });
        expect(view.getResourceSet()).toEqual(updatedmockResourceSet);
    });
});

export const mockResourceSet: EResource[] = [
    {
        uri: "/example.model",
        content: {
            eClass: "http://vitruv.tools/methodologisttemplate/model#//System",
            _id: "/",
            components: [
                {
                    _id: "//@components.0",
                    name: "New Component",
                },
                {
                    _id: "//@components.1",
                    name: "Another New Component",
                },
            ],
        },
    },
    {
        uri: "/example.model2",
        content: {
            eClass: "http://vitruv.tools/methodologisttemplate/model2#//Root",
            _id: "/",
            entities: [
                {
                    _id: "//@entities.0",
                    name: "New Component",
                },
                {
                    _id: "//@entities.1",
                    name: "Another New Component",
                },
            ],
        },
    },
];

export const updatedmockResourceSet: EResource[] = [
    {
        uri: "/example.model",
        content: {
            eClass: "http://vitruv.tools/methodologisttemplate/model#//System",
            _id: "/",
            components: [
                {
                    _id: "//@components.0",
                    name: "Updated Component",
                },
                {
                    _id: "//@components.1",
                    name: "Another New Component",
                },
            ],
        },
    },
    {
        uri: "/example.model2",
        content: {
            eClass: "http://vitruv.tools/methodologisttemplate/model2#//Root",
            _id: "/",
            entities: [
                {
                    _id: "//@entities.0",
                    name: "New Component",
                },
                {
                    _id: "//@entities.1",
                    name: "Another New Component",
                },
            ],
        },
    },
];
