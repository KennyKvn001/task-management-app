import {AuthProvider} from "../context/AuthContext.tsx";
import {TaskProvider} from "../context/TaskContext.tsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {NotFound} from "../views/NotFound.tsx";
import {Home} from "../views/Home.tsx";
import {Register} from "../views/Register.tsx";
import {Login} from "../views/Login.tsx";
import {Task} from "../views/Task.tsx";
import {ProtectedRoute} from "./ProtectedRoutes.tsx";

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
        element: <ProtectedRoute><Task/></ProtectedRoute>
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
            <TaskProvider>
                <RouterProvider router={router} />
            </TaskProvider>
        </AuthProvider>
    );
}