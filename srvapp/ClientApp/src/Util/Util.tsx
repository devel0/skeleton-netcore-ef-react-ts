import React from 'react';
import moment from "moment";
import { toast, ToastContent } from "react-toastify";
import Constants from "../Constants";
import * as icons from "@material-ui/icons";
import { createMuiTheme, Theme } from '@material-ui/core';
import { SystemStore } from '../components/store/SystemStore';
import { storeNfo } from '../components/store/StoreUtils';
import * as _ from 'lodash';
import { ICommonResponse } from "../api-autogen/srvapp/ICommonResponse";
import { CommonResponseExitCodes } from '../api-autogen/srvapp/CommonResponseExitCodes';
import { ICommonRequest } from '../api-autogen/srvapp/ICommonRequest';

export function defaultRequest() {
    const token = sessionStorage.getItem('token') || "";    
    return { authToken: token } as ICommonRequest;
}

/** notify success */
export function notifySuccess(str: ToastContent, autoClose: number | false = Constants.NOTIFY_DURATION_MS) {
    if (str) {
        // https://github.com/fkhadra/react-toastify#installation
        toast.success(str, {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: autoClose
        });
    }
}

/** notify info */
export function notifyInfo(str: ToastContent, autoClose: number | false = Constants.NOTIFY_DURATION_MS) {
    if (str) {
        // https://github.com/fkhadra/react-toastify#installation
        toast.info(str, {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: autoClose
        });
    }
}

/** notify error */
export function notifyError(str: ToastContent, autoClose: number | false = Constants.NOTIFY_DURATION_MS) {
    if (str) {
        // https://github.com/fkhadra/react-toastify#installation
        toast.error(str, {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: autoClose
        });
    }
}

/** returns true if successful, false otherwise ( error or invaild auth ) */
export function checkApiResult(res: ICommonResponse) {
    if (res.exitCode !== CommonResponseExitCodes.Successful) {
        switch (res.exitCode) {
            case CommonResponseExitCodes.InvalidAuth:
                {
                    //window.location.href = "/login";
                    notifyError("auth invalid");
                    //sessionStorage.removeItem('user');
                }
                break;
        }
        return false;
    }

    return true;
}

/** convert ISO8601 date ( eg. "2019-01-16T07:29:29.834798" ) to moment object */
function utcDateToMomentObj(dt: string | Date) {
    return moment.utc(dt);
}

/** convert moment object to datetime local string format */
function momentObjToLocalStrLong(dm: moment.Moment) {
    return dm.local().format("llll");
}

/** convert moment object to datetime local string format */
function momentObjToLocalStrShort(dm: moment.Moment) {
    return dm.local().format("L") + " " + dm.local().format("LT");
}

/** convert utc datetime string to local datetime string */
export function utcDateToLocalStrLong(dt: string | Date) {
    return momentObjToLocalStrLong(utcDateToMomentObj(dt));
}

/** convert utc datetime string to local datetime short string */
export function utcDateToLocalStrShort(dt: string | Date) {
    return momentObjToLocalStrShort(utcDateToMomentObj(dt));
}

/** convert utc datetime string to YYYY-MM-DD format */
export function utcDateToInvariantStr(dt: string | Date) {
    const q = utcDateToMomentObj(dt).format("YYYY-MM-DD");
    return q;
}

export function compareNullableDate(a: Date | null | undefined, b: Date | null | undefined) {
    let ascRes = 1;
    if ((a === null || a === undefined) && (b === null || b === undefined)) ascRes = -1;
    else if (a === null || a === undefined) ascRes = 1;
    else if (b === null || b === undefined) ascRes = -1;
    else {
        const ta = new Date(a).getTime();
        const tb = new Date(b).getTime();
        ascRes = ta < tb ? -1 : 1;
    }

    return ascRes;
}

/**
 * round given value using the multiple basis 
 */
export function mround(value: number, multiple: number) {
    if (Math.abs(multiple) < Number.EPSILON) {
        return value;
    }

    const p = Math.round(value / multiple);

    return Math.trunc(p) * multiple;
}

/** https://github.com/devel0/js-util/blob/master/src/js-util.js */
export function humanReadableFilesize({ bytes, onlyBytesUnit = true, bytesMultiple = 1, decimals = 1 }:
    { bytes: number; onlyBytesUnit?: boolean; bytesMultiple?: number; decimals?: number; }) {
    const k = 1024.0;
    const m = k * 1024.0;
    const g = m * 1024.0;
    const t = g * 1024.0;

    if (bytesMultiple !== 1) {
        bytes = Math.trunc(mround(bytes, bytesMultiple));
    }

    if (bytes < k) {
        if (onlyBytesUnit) {
            return bytes;
        } else {
            return bytes + " b";
        }
    } else if (bytes >= k && bytes < m) {
        return (bytes / k).toFixed(decimals) + " Kb";
    } else if (bytes >= m && bytes < g) {
        return (bytes / m).toFixed(decimals) + " Mb";
    } else if (bytes >= g && bytes < t) {
        return (bytes / g).toFixed(decimals) + " Gb";
    } else {
        return (bytes / t).toFixed(decimals);
    }
}

/**
 * execute foreach callback sweeping given array
 * refs: https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
 */
export async function asyncForEach<T>(array: T[], callback: (val: T, idx: number, arr: T[]) => void) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

/** awaitable sleep */
export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/** create path from type. usage pathBuilder<type>()("xxx", "yyy", ...) */
export function pathBuilder<T>() {
    return <
        K1 extends keyof T,
        K2 extends keyof NonNullable<T[K1]>,
        K3 extends keyof NonNullable<NonNullable<T[K1]>[K2]>,
        K4 extends keyof NonNullable<NonNullable<NonNullable<T[K1]>[K2]>[K3]>,
        K5 extends keyof NonNullable<NonNullable<NonNullable<NonNullable<T[K1]>[K2]>[K3]>[K4]>,
        >
        (p1: K1, p2?: K2, p3?: K3, p4?: K4, p5?: K5) => {
        let res = String(p1);
        if (p2) { res += "." + p2; }
        if (p3) { res += "." + p3; }
        if (p4) { res += "." + p4; }
        if (p5) { res += "." + p5; }
        return res;
    };
}

// https://dev.to/flexdinesh/cache-busting-a-react-app-22lk
// version from `meta.json` - first param
// version in bundle file - second param
export const semverGreaterThan = (versionA: string, versionB: string) => {
    const versionsA = versionA.split(/\./g);

    const versionsB = versionB.split(/\./g);
    while (versionsA.length || versionsB.length) {
        const a = Number(versionsA.shift());

        const b = Number(versionsB.shift());
        // eslint-disable-next-line no-continue
        if (a === b) continue;
        // eslint-disable-next-line no-restricted-globals
        return a > b || isNaN(b);
    }
    return false;
};

/** dup object using JSON serialize/deserialize */
export function dupObj<T>(obj: T) {    
    return _.cloneDeep(obj) as T;
}

export function notifyException(systemNfo: storeNfo<SystemStore>, data: ICommonResponse) {
    systemNfo.set((x) => {
        x.errorMessage = data.errorMsg;
        x.errorStacktrace = data.stackTrace;
    });
}

export function readonlyCheckbox(value: boolean) {
    if (value)
        return <icons.Done />;
    else
        return null;
}

export const theme = createMuiTheme({
    // palette:{

    // }
    // typography: {
    //   fontFamily: '"Product Sans", serif',
    // },
});

export const defaultFont = theme.typography.fontSize + "px " + theme.typography.fontFamily;
export const defaultFontBold = "bold " + defaultFont;

// https://github.com/mui-org/material-ui/issues/11517#issuecomment-407509327
export function combineStyles(...styles: any[]) {
    return function CombineStyles(theme: Theme) {
        const outStyles = styles.map((arg) => {
            // Apply the "theme" object for style functions.
            if (typeof arg === "function") {
                return arg(theme);
            }
            // Objects need no change.
            return arg;
        });

        return outStyles.reduce((acc, val) => ({ ...acc, ...val }));
    };
}
