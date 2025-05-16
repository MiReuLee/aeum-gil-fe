import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './index.css'
import App from './App.tsx'
import { Login } from './pages/Login';
// import { Journey } from './pages/Journey';
import { Editor } from './pages/Editor/index';
import { Home } from './pages/Home';
import { Page } from './pages/Page/index.tsx';
import { Chapter } from './pages/Chapter/index.tsx';
import { Ending } from './pages/Ending/index.tsx';
import { Register } from './pages/Register/index.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/journey" element={<Journey />} /> */}
          <Route path="/pages" element={<Editor />} />
          {/* <Route path="/pages/:pageId" element={<Editor />} /> */}
          <Route path="/pages/:pageId" element={<Page />} />
          <Route path="/chapter/:chapterId" element={<Chapter />} />
          <Route path="/ending/:endingId" element={<Ending />} />
        </Routes>
        
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
)