import React from 'react';
import { Login, LoginForm } from 'react-admin';
import { withStyles } from '@material-ui/core/styles';

/** Remove unsplash.com background image for faster page loads (e.g. during E2E tests) */
const styles = {
  main: { backgroundImage: 'linear-gradient(#fff, #bcd)' },
};
const CustomLoginPage = props => (
  <Login loginForm={<LoginForm />} backgroundImage="none" {...props} />
);

export default withStyles(styles)(CustomLoginPage);
