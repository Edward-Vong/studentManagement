import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ component: Component, roles }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    if (!token) {
        return <Navigate to="/login" />;
    } else if (!roles.includes(userRole)) {
        return <Navigate to="/" />;
    }

    return <Component />;
};

ProtectedRoute.propTypes = {
    component: PropTypes.elementType.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

export default ProtectedRoute;
