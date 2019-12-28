import React, { useEffect, useRef, useLayoutEffect, useCallback } from "react";
import { Button, Dialog, DialogTitle, DialogContentText, DialogActions, DialogContent } from "@material-ui/core";

export enum AlertDialogButtons {
    Yes, No, Cancel
}

export interface AlertDialogProps {
    open: boolean;
    onClose: (result?: AlertDialogButtons) => void;
    title: string;
    msg: string;
    /** (default: Yes) */
    defaultButton?: AlertDialogButtons;
    /** default Yes, No */
    buttons?: AlertDialogButtons[];
}

const AlertDialogBtns = (props: AlertDialogProps) => {
    const btnYesRef = useRef<HTMLButtonElement>(null);
    const btnNoRef = useRef<HTMLButtonElement>(null);
    const btnCancelRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (btnYesRef && btnYesRef.current && (props.defaultButton === undefined || props.defaultButton === AlertDialogButtons.Yes)) {
            btnYesRef.current.focus();
        }
        if (btnNoRef && btnNoRef.current && (props.defaultButton !== undefined && props.defaultButton === AlertDialogButtons.No)) {
            btnNoRef.current.focus();
        }
        if (btnCancelRef && btnCancelRef.current && (props.defaultButton !== undefined && props.defaultButton === AlertDialogButtons.Cancel)) {
            btnCancelRef.current.focus();
        }
    }, [btnYesRef, btnNoRef, btnCancelRef]);

    const handleKeydown = (e: KeyboardEvent) => {
        const btns = props.buttons === undefined ? [AlertDialogButtons.Yes, AlertDialogButtons.No] : props.buttons;

        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            let curBtn = 0;
            if (btnYesRef.current && document.activeElement === btnYesRef.current) curBtn = 0;
            else if (btnNoRef.current && document.activeElement === btnNoRef.current) curBtn = 1;
            else if (btnCancelRef.current && document.activeElement === btnCancelRef.current) curBtn = 2;

            if (e.key === "ArrowRight") curBtn = (curBtn === btns.length - 1) ? 0 : (curBtn + 1);
            else if (e.key === "ArrowLeft") curBtn = (curBtn === 0) ? (btns.length - 1) : (curBtn - 1);

            switch (btns[curBtn]) {
                case AlertDialogButtons.Yes: if (btnYesRef.current) btnYesRef.current.focus(); break;
                case AlertDialogButtons.No: if (btnNoRef.current) btnNoRef.current.focus(); break;
                case AlertDialogButtons.Cancel: if (btnCancelRef.current) btnCancelRef.current.focus(); break;
            }
        }
    };

    const divRef = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        if (divRef.current) divRef.current.addEventListener("keydown", handleKeydown, { passive: true });
        return () => {
            if (divRef.current) divRef.current.removeEventListener("keydown", handleKeydown);
        }
    }, [divRef, props]);

    return (
        <div ref={divRef}>
            {(props.buttons === undefined || props.buttons.indexOf(AlertDialogButtons.Yes) !== -1) ?
                <Button ref={btnYesRef} onClick={() => props.onClose(AlertDialogButtons.Yes)} color="primary">Si</Button> : null}

            {(props.buttons === undefined || props.buttons.indexOf(AlertDialogButtons.No) !== -1) ?
                <Button ref={btnNoRef} onClick={() => props.onClose(AlertDialogButtons.No)} color="primary">No</Button> : null}

            {(props.buttons !== undefined && props.buttons.indexOf(AlertDialogButtons.Cancel) !== -1) ?
                <Button ref={btnCancelRef} onClick={() => props.onClose(AlertDialogButtons.Cancel)} color="primary">Annulla</Button> : null}
        </div>
    );
}

export default function AlertDialog(props: AlertDialogProps) {
    return (
        <div>
            <Dialog
                open={props.open}
                onClose={() => props.onClose()}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">{props.msg}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <AlertDialogBtns {...props} />
                </DialogActions>
            </Dialog>
        </div>
    );
}