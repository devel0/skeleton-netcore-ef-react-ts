import * as React from 'react';
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import './custom.css'
import MyAppBar from './components/MyAppBar';
import Constants from './Constants';
import { ToastContainer } from 'react-toastify';
import * as _ from 'lodash';
import { createStore } from 'react-hookstore';
import { SystemStore, useSystem } from './components/store/SystemStore';
import { PrivateRoute } from './components/PrivateRoute';
import ErrorPage from './components/ErrorPage';
import { useWindowSize } from 'react-ws-canvas';
import { ExampleStore } from './components/store/ExampleStore';

// EP: create stores

createStore("system", new SystemStore());
createStore("example", new ExampleStore());

export default function App() {
    const system = useSystem();
    const history = useHistory();
    const location = useLocation();
    const winSize = useWindowSize();

    // EP: router

    return (
        <div>
            <MyAppBar />
            <Layout >
                <Switch>
                    {/* <Route path='/login'>
                        <Login />
                    </Route> */}

                    <PrivateRoute exact path="/" allowed={true /* TODO: permissions */} deniedPage="Home" >
                        <Home />
                    </PrivateRoute>
                    <PrivateRoute exact path="/home" allowed={true /* TODO: permissions */} deniedPage="Home" >
                        <Home />
                    </PrivateRoute>
                    <PrivateRoute path='/error' allowed={true} /* TODO: permissions */ >
                        <ErrorPage />
                    </PrivateRoute>

                </Switch>
            </Layout>
            <ToastContainer autoClose={Constants.NOTIFY_DURATION_MS} />
        </div>
    );
}