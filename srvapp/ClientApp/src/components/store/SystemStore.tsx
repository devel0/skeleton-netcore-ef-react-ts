import React from 'react';
import * as _ from 'lodash';
import { useStoreNfo } from "./StoreUtils";

// edit also App.tsx ( entrypoint: create stores )

export class SystemStore {
    constructor() {        
        this.loading = false;
        this.development = false;
        this.errorMessage = undefined;
        this.errorStacktrace = undefined;        
    }
    
    loading: boolean;
    development: boolean;
    errorMessage?: string;
    errorStacktrace?: string;    
}

export const useSystem = () => useStoreNfo<SystemStore>("system");
