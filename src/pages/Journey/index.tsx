import { Grid2 } from '@mui/material';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function Journey() {
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
    <div>
      <h1>Journey</h1>

      <Grid2>
        {pages.map((page: any) => (
          <Grid2 key={`page-${page.id}`}>
            <Link to={`/pages/${page.id}`}><h2>{page.title}</h2></Link>
            <ul>
              {page.choiceOptions.map((choiceOption: any) => (
                <li key={`choiceOption-${choiceOption.id}`}>{choiceOption.content}</li>
              ))}
            </ul>
          </Grid2>
        ))}
      </Grid2>
    </div>
  );
};
