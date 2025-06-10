import {AuthProvider} from "../context/AuthContext.tsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {NotFound} from "../views/NotFound.tsx";
import {Home} from "../views/Home.tsx";
import {Register} from "../views/Register.tsx";
import {Login} from "../views/Login.tsx";
import {Task} from "../views/Task.tsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/tasks',
        element: <Task/>
    },
    {
        path:'*',
        element: <NotFound />
    }
], {
    basename: '/quinoa'
});

export function Routes() {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    );
}