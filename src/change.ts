export type ChangeType = "TRANSACTIONAL" | "COMPOSITE";

export interface VitruvChange {
    changeType: ChangeType;
}

export interface TransactionalChange extends VitruvChange {
    changeType: "TRANSACTIONAL";
    eChanges: EChange[];
}

export interface CompositeChange extends VitruvChange {
    changeType: "COMPOSITE";
    vChanges: VitruvChange[];
}

export interface EChange {
    content: any;
    uri: string | "temp";
}
