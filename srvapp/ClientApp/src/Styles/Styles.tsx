import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core";

export const commonStyles = makeStyles((theme: Theme) =>
    createStyles({
        /** space this left icon from a right element */
        leftIcon: {
            marginRight: theme.spacing(1),
        },
        /** space this right icon from a left element */
        rightIcon: {
            marginLeft: theme.spacing(1),
        },
        textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            marginTop: theme.spacing(1)
        },
        textField50: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            marginTop: theme.spacing(1),
            width: 50
        },
        textField100: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            marginTop: theme.spacing(1),
            width: 100
        },
        textField250: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            marginTop: theme.spacing(1),
            width: 250
        },
        textField350: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            marginTop: theme.spacing(1),
            width: 300
        },
        largeField: {
            width: 200,
        },
        code: {
            fontFamily: "monospace",
            fontSize: theme.typography.body1.fontSize,
        },
        formContainer: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        title: {
            fontWeight: "bold",
            fontSize: "150%",
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2)
        },
        subTitle: {
            fontWeight: "bold",
            fontSize: "110%",
        },
        tip: {
            color: "navy"
        },
        bg0: {
            background: "yellow"
        },
        bg1: {
            background: "green"
        },
        displayNone: {
            display: 'none',
        },
        textDisabled: {
            color: "lightGray",
        },

        // ------------------------------ SPACINGS

        spaceTop0: {
            marginTop: theme.spacing(0)
        },
        spaceTop1: {
            marginTop: theme.spacing(1)
        },
        spaceTop2: {
            marginTop: theme.spacing(2)
        },

        spaceBottom0: {
            marginBottom: theme.spacing(0)
        },
        spaceBottom1: {
            marginBottom: theme.spacing(1)
        },
        spaceBottom2: {
            marginBottom: theme.spacing(2)
        },

        spaceLeft0: {
            marginLeft: theme.spacing(0)
        },
        spaceLeft1: {
            marginLeft: theme.spacing(1)
        },
        spaceLeft2: {
            marginLeft: theme.spacing(2)
        },

        spaceRight0: {
            marginRight: theme.spacing(0)
        },
        spaceRight1: {
            marginRight: theme.spacing(1)
        },
        spaceRight2: {
            marginRight: theme.spacing(2)
        },

        // -------------------------------

        toolbar: {
            background: "#bebebe",
        },

        formControl: {
            margin: theme.spacing(3)
        },
        gridCustomFormControl: {
            margin: 0,
            padding: 0
        },
    })
);

