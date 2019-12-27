import React from 'react';
import * as _ from 'lodash';
import { useStoreNfo, storeNfo } from "./StoreUtils";
import { SystemStore } from './SystemStore';
import { stringifyRefs, parseRefsResponse } from 'json-serialize-refs';
import { defaultRequest, checkApiResult, notifyException, notifyError, notifySuccess } from '../../Util/Util';
import { ITemplatedResponse } from '../../api-autogen/srvapp/ITemplatedResponse';
import { ISampleTable } from '../../api-autogen/srvapp/ISampleTable';
import { ITemplatedRequest } from '../../api-autogen/srvapp/ITemplatedRequest';
import { ICommonResponse } from '../../api-autogen/srvapp/ICommonResponse';

// edit also App.tsx ( entrypoint: create stores )

export class ExampleStore {
    constructor() {
        this.apiData = [];        
    }

    apiData: ISampleTable[];    
}

export const useExample = () => useStoreNfo<ExampleStore>("example");

export function addExample(system: storeNfo<SystemStore>, sample: ISampleTable) {
    system.set((x) => x.loading = true);

    const q = Object.assign(defaultRequest(), {
        data: sample
    } as ITemplatedRequest<ISampleTable>);
    var qj = stringifyRefs(q);

    fetch('example/addSample',
        {
            method: 'post',
            headers: { 'Content-Type': 'application/json', },
            body: stringifyRefs(Object.assign(defaultRequest(), {
                data: sample
            } as ITemplatedRequest<ISampleTable>))
        })
        .then(response => parseRefsResponse<ICommonResponse>(response.text()))
        .then(data => {
            system.set((x) => x.loading = false);
            if (checkApiResult(data)) {
                notifySuccess("data saved");
            } else {
                notifyException(system, data);
                system.set((x) => x.loading = false);
            }
        })
        .catch((reason) => {
            notifyError("error [" + reason + "]");
            system.set((x) => x.loading = false);
        });
}

export function getExamples(system: storeNfo<SystemStore>, example: storeNfo<ExampleStore>) {
    system.set((x) => x.loading = true);

    fetch('example/loadSamples',
        {
            method: 'post',
            headers: { 'Content-Type': 'application/json', },
            body: stringifyRefs(Object.assign(defaultRequest(), {}))
        })
        .then(response => {
            if (response.ok)
                return parseRefsResponse<ITemplatedResponse<ISampleTable[]>>(response.text());
            else {
                throw "status=" + response.status;
            }
        })
        .then(data => {
            system.set((x) => x.loading = false);
            if (checkApiResult(data)) {
                
                example.set((x) => {
                    x.apiData = data.data;                    
                });
            }
            else {
                notifyException(system, data);
                system.set((x) => x.loading = false);
            }
        })
        .catch((reason) => {
            notifyError("error [" + reason + "]");
            system.set((x) => x.loading = false);
        });
}
