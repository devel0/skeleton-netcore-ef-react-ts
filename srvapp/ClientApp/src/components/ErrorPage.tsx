import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';
import { Grid, Button, Paper } from '@material-ui/core';
import { commonStyles } from '../Styles/Styles';
import { FaArrowCircleLeft } from 'react-icons/fa';
import { useSystem } from './store/SystemStore';

export default function ErrorPage() {
  const systemNfo = useSystem();

  // EP: CLASSES
  const classes = commonStyles();
  const classes2 = makeStyles((theme: Theme) =>
    createStyles({
      msgPaper: {
        padding: theme.spacing(2),
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
      },
    }))();

  function stackTraceHtml() {
    if (systemNfo.state.errorStacktrace) {
      return systemNfo.state.errorStacktrace;
    } else {
      return "";
    }
  }

  const history = useHistory();

  if (!systemNfo.state.errorMessage) {
    history.push("/");
  }

  return (
    <Grid
      className={classes.spaceTop2}
      container={true}
      direction="column"
      justify="flex-start"
      alignItems="stretch"
    >
      <Grid item={true}>
        <Grid
          container={true}
          direction="row"
          justify="flex-start"
          alignItems="center"
        >
          <Grid item={true}>
            <Button
              color="primary"
              className={classes.leftIcon}
              onClick={() => {
                systemNfo.set((x) => {
                  x.errorMessage = undefined;
                  x.errorStacktrace = undefined;
                });
                history.push('/');
              }}
            >
              <FaArrowCircleLeft />
            </Button>
          </Grid>
          <Grid item={true}>
            <Typography variant="h5">{"Server exception"}</Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item={true}>
        <Paper className={classes2.msgPaper}>
          <Typography color="secondary" className={classes.code}>{systemNfo.state.errorMessage}</Typography>

          <Typography variant="h6" className={classes.spaceTop2}>{"Stacktrace"}</Typography>

          <Typography className={classes.code}>{stackTraceHtml()}</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}