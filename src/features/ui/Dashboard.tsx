import { useEffect } from "react";
import { useAuth } from "../auth/contexts/AuthContext";
import { useNavigate } from "react-router-dom";


function Dashboard(){
const navigate = useNavigate()
const {user, isAuthenticated, logout} = useAuth();

// ? Replace this with a handleLogout function which calls logout AND navigates to home page or login page.
useEffect(()=>{
    if (!isAuthenticated) navigate('/', {replace: true})
})

    return (
        <div>
            <h2>{`Welcome, ${user?.name || 'error'}`}</h2>
            <button onClick={logout}>Logout</button>
        </div>
    )
}

export default Dashboard;
