import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Box } from '@mui/material';
import { Editor } from './pages/Editor';
import { Journey } from './pages/Journey';

function App() {
  const [pages, setPages] = useState([]);

  const getPages = async () => {
    return await (await fetch('http://api.aeum-gil.com/pages', {
      headers: {
        'Content-Type': 'application/json',
      }
    })).json();
  }

  useEffect(() => {
    getPages().then((data) => {
      setPages(data);
    });
  }, []);

  return (
    <>
      <BrowserRouter>
        <Box component="nav" display="flex" gap="4px">
          <Link to="/journey">저니맵</Link>
          <Link to="/pages">신규</Link>
          {/* {pages.map((page: any) => (
            <Link key={page.id} to={`/pages/${page.id}`}>{page.title}</Link>
          ))} */}
        </Box>
        <Routes>
          <Route path="/journey" element={<Journey />} />
        </Routes>
        <Routes>
          <Route path="/pages" element={<Editor />} />
        </Routes>
        <Routes>
          <Route path="/pages/:pageId" element={<Editor />} />
        </Routes>
      </BrowserRouter>

      <Box component="footer" display="flex" justifyContent="center" alignItems="center" height="100px">
        <Box>© 2025 aeum-gil.com</Box>
        <Box ml="auto">Powered by aeum-gil</Box>
      </Box>
    </>
  );
};

export default App;
