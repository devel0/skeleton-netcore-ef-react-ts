import 'bootstrap/dist/css/bootstrap.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
// EP: CSS LIB
import "react-toastify/dist/ReactToastify.css";
import { notifyInfo, semverGreaterThan } from './Util/Util';
import { appVersion } from './components/MyAppBar';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href') as string;

fetch('meta.json?q=' + new Date().getTime())
    .then(response => response.json())
    .then(data => {
        const latestVersion = data.version as string;
        const currentVersion = appVersion;

        console.log('remote version:' + latestVersion + ' ; cached version:' + currentVersion);

        const currentVersionObsolete = semverGreaterThan(latestVersion, currentVersion);
        if (currentVersionObsolete) {
            if (caches) {
                caches.keys().then(function (names) {
                    for (let name of names) caches.delete(name);
                });
            }
            notifyInfo('new version available press F5 to update', false);
        }

        const history = createBrowserHistory();

        ReactDOM.render(
            <Router history={history}>
                <App />
            </Router>,
            document.getElementById('root'));

        registerServiceWorker();

    });
