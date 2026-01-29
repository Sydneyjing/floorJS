import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import AdFloor from '../pages/AdFloor';
import FloorConfig from '../pages/FloorConfig';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: 'adfloor',
                element: <AdFloor />,
            },
            {
                path: 'floor-config',
                element: <FloorConfig />,
            },
        ],
    },
]);
