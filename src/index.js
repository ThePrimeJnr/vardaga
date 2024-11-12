import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from "./App";
import reportWebVitals from './reportWebVitals';
import {
    createBrowserRouter, createMemoryRouter,
    RouterProvider,
} from "react-router-dom";
import IntentSelection from "./screens/IntentSelection";
import Chat from "./screens/Chat";
import {ChatProvider} from "./components/ChatContext";

const router = createMemoryRouter(
    [
        {
            path: '/',
            element: <App/>,
            children: [{
                path: '/test',
                element: <div>Hi from test</div>
            },
                {
                    path: '',
                    element: <IntentSelection/>
                },
                {
                    path: '/chat',
                    element:
                        <Chat/>

                }
            ]
        },
    ]
)
const root = ReactDOM.createRoot(document.getElementById('Chatbot'));
root.render(
    <ChatProvider>
        <RouterProvider router={router}/>
    </ChatProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
