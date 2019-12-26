import React from 'react';
import { useSystem } from './store/SystemStore';
import { Button, TextField, Grid, Box, Typography } from '@material-ui/core';
import { useExample, getExamples, addExample } from './store/ExampleStore';
import { ISampleTable } from '../api-autogen/srvapp/ISampleTable';
import { useWindowSize } from 'react-ws-canvas';

export default function Home() {
  const system = useSystem();
  const example = useExample();
  const winSize = useWindowSize();

  return (
    <Grid container direction="column">
      <Grid item>
        <Grid container direction="row">
          <Grid item>
            <Button variant="contained" color="primary" onClick={() => {
              addExample(system, {
                user_timestamp: new Date()
              } as ISampleTable)
            }}>ADD</Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={() => {
              getExamples(system, example)
            }}>GET LIST</Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid item>
        <Box border="1px solid black" padding="1em" marginTop="1em">
          <code style={{whiteSpace: "pre-wrap"}}>
            {example.state.apiResult}
          </code>
        </Box>
      </Grid>
    </Grid>
  );
}
