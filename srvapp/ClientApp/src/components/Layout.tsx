import * as React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSystem } from './store/SystemStore';

// EP: OWN PROPS
interface ownProps {
    children?: React.ReactNode;
}

type LayoutProps = ownProps;

export default function Layout(props: LayoutProps) {
    const system = useSystem();
    const history = useHistory();
    const location = useLocation();

    if (system.state.errorMessage && location.pathname !== '/error') {
        history.push('/error');
    }

    // useEffect(() => {
    //     // resume current user
    //     if (system.state.currentUser === undefined) {
    //         if (sessionStorage.getItem('token') !== null) {
    //             if (document.location.href.startsWith("https://localhost") || document.location.href.startsWith("http://0.0.0.0")) {
    //                 system.set((x) => x.development = true);
    //             }
    //             tryLogin(system, sessionStorage.getItem('token')!);
    //         } else {
    //             history.push("/login");
    //         }
    //     }
    // }, []);    

    return (
        <React.Fragment>
            <div>                
                <div style={{ margin: "2em", marginTop: "1em" }}>
                    {props.children}
                </div>
            </div>
        </React.Fragment >
    );
}
