import * as React from 'react';
import {
    Route,
    RouteProps,
    useHistory,
    useLocation,
} from 'react-router-dom';
import { notifyError } from '../Util/Util';
import { FunctionComponent } from 'react';

interface ownProps {
    // tslint:disable-next-line:no-any    
    allowed: boolean;
    deniedPage?: string;
}

type PrivateRouteProps = RouteProps & ownProps;

export const PrivateRoute: FunctionComponent<PrivateRouteProps> = (props) => {
    const history = useHistory();
    const location = useLocation();
    
    // TODO: implement your auth logic
    // if (!sessionStorage.getItem('token') && history.location.pathname !== '/login') {
    //     history.push('/login', { from: history.location });
    // }        

    return (
        <Route
            path={props.path}            
            render={(routeProps) => {
                if (!props.allowed) {
                    if (props.deniedPage)
                        notifyError("Access denied to page [" + props.deniedPage + "]", false);
                    else
                        notifyError("Access denied to paage", false);
                    history.push('/');
                }                

                return props.children;
            }}
        />
    );
};
