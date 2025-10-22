import { View, ViewType, VitruvClient } from "../src";

/**
 * These tests require a running Vitruv server at http://localhost:8000
 * Make sure to start the server before running these tests.
 * The tests expect the vsum to have the model from the Methodologist-Template
 */

// Skip tests if no url is provided
const url = undefined;
const ifit = url ? it : it.skip;

describe("Test on server", () => {
    const client = url
        ? new VitruvClient(url)
        : (undefined as unknown as VitruvClient);

    ifit("is healthy", () => {
        expect(client.isHealthy()).resolves.toBe(true);
    });

    ifit("can open a view", async () => {
        const viewTypes = await client.getViewTypes();
        expect(viewTypes.length).toBeGreaterThan(0);
        const viewType = viewTypes[0];
        const view = await newView(viewType);
        expect(view).toBeInstanceOf(View);
        expect(view).toBeDefined();
        expect(view.getResourceSet()).toEqual(resourceSet);
    });

    ifit("can commit changes", async () => {
        const viewTypes = await client.getViewTypes();
        expect(viewTypes.length).toBeGreaterThan(0);
        const viewType = viewTypes[0];
        const view = await newView(viewType);
        expect(view).toBeDefined();
        expect(view.getResourceSet()).toEqual(resourceSet);

        view.updateResourceSet(changes1);
        await view.commitChanges();

        // We have to open a new view to with components in the selector to see the components
        const view2 = await newView(viewType);
        expect(view2.getResourceSet()).toEqual(resourceSetAfterChanges1);
    });

    ifit("can make changes with references", async () => {
        const viewTypes = await client.getViewTypes();
        expect(viewTypes.length).toBeGreaterThan(0);
        const viewType = viewTypes[0];
        const view = await newView(viewType);
        expect(view).toBeDefined();
        expect(view.getResourceSet()).toEqual(resourceSetAfterChanges1);

        view.updateResourceSet(changes2);
        await view.commitChanges();

        const view2 = await newView(viewType);
        expect(view2.getResourceSet()).toEqual(resourceSetAfterChanges2);
    });
});

function changes1(rs: any) {
    rs[0].content.components = [
        {
            name: "New Component",
        },
        {
            name: "Another New Component",
        },
    ];
    return rs;
}

function changes2(rs: any) {
    rs[0].content.links = [
        {
            components: [
                {
                    $ref: "//@components.0",
                },
                {
                    $ref: "//@components.1",
                },
            ],
        },
    ];
    return rs;
}

async function newView(viewType: ViewType) {
    const selector = await viewType.getSelectors();
    return await selector.openView();
}

const resourceSet = [
    {
        uri: "/example.model",
        content: {
            eClass: "http://vitruv.tools/methodologisttemplate/model#//System",
            _id: "/",
        },
    },
    {
        uri: "/example.model2",
        content: {
            eClass: "http://vitruv.tools/methodologisttemplate/model2#//Root",
            _id: "/",
        },
    },
];

const resourceSetAfterChanges1 = [
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

const resourceSetAfterChanges2 = [
    {
        uri: "/example.model",
        content: {
            eClass: "http://vitruv.tools/methodologisttemplate/model#//System",
            _id: "/",
            links: [
                {
                    _id: "//@links.0",
                    components: [
                        {
                            eClass: "http://vitruv.tools/methodologisttemplate/model#//Component",
                            $ref: "//@components.0",
                        },
                        {
                            eClass: "http://vitruv.tools/methodologisttemplate/model#//Component",
                            $ref: "//@components.1",
                        },
                    ],
                },
            ],
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
            links: [
                {
                    _id: "//@links.0",
                    entities: [
                        {
                            eClass: "http://vitruv.tools/methodologisttemplate/model2#//Entity",
                            $ref: "//@entities.0",
                        },
                        {
                            eClass: "http://vitruv.tools/methodologisttemplate/model2#//Entity",
                            $ref: "//@entities.1",
                        },
                    ],
                },
            ],
        },
    },
];
