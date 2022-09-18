
import { Navigate } from 'react-router-dom';
import { useQueryClient } from "react-query";

//@ts-ignore

export const ProtectedRoute = ({ user, children }) => {
if (!user) {
return <Navigate to="/login" replace />;
    }
 return children;
  };
