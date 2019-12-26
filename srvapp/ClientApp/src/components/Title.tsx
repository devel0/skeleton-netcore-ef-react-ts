import React, { FunctionComponent } from 'react';
import { commonStyles } from '../Styles/Styles';
import _ from 'lodash';
import { Typography } from '@material-ui/core';

interface TitleProps {
  content: string | JSX.Element;
  level: number;
}

// EP: children
const Title: FunctionComponent<TitleProps> = (props) => {

  const classes = commonStyles();

  return (
    <div style={{ marginTop: "1em", marginBottom: "1em" }}>
      {typeof (props.content) === "string" ?
        ((props.level === 1) ?
          <Typography variant="h4">
            {props.content}
            {props.children}
          </Typography> :
          (props.level > 1) ?
            <Typography className={classes.title}>
              {props.content}
              {props.children}
            </Typography> : null)
        :
        props.content}
    </div>);

}

export default Title;