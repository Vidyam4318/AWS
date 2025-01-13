import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { firebase } from './firebaseConfig';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const [isAdmin, setIsAdmin] = React.useState(false);

    React.useEffect(() => {
        const checkAdmin = async () => {
            const user = firebase.auth().currentUser;
            if (user) {
                const idTokenResult = await user.getIdTokenResult();
                if (idTokenResult.claims.role === 'admin') {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            }
        };

        checkAdmin();
    }, []);

    return (
        <Route
            {...rest}
            render={(props) =>
                isAdmin ? <Component {...props} /> : <Redirect to="/AdminLogin" />
            }
        />
    );
};

export default PrivateRoute;
