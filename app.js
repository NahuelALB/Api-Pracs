const express = require('express');
const app = express();
const PORT = process.env.PORT ?? 1234;
const movies = require('./movies.json');
const crypto = require('node:crypto');
const z = require('zod');

app.disable('x-powered-by');
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('<h1>Hola mundo</h1>');
});

//Recurso que se identifica con "/movies" para el listado o sea un endPoint
app.get('/movies', (req, res) => {
  const { genre } = req.query;
  if (genre) {
    const filterMovie = movies.filter((movie) => {
      let lowerMovie = movie.genre;
      return lowerMovie.toLowerCase() == genre.toLowerCase();
    });
    return res.json(filterMovie);
  }
  res.json(movies);
});

//Recurso que se con "/movies/:id" para un detalle, otro endpoint
app.get('/movies/:id', (req, res) => {
  const { id } = req.params;
  const movie = movies.find((elem) => {
    return elem.id == id;
  });
  if (movie) return res.json(movie);
  res.status(404).json({ message: 'Movie Not Found' });
});

//Recurso para crear una pelicula
app.post('/movies', (req, res) => {
  const { Title, genre, Year, Runtime, Poster } = req.body;
  const newMovie = {
    id: crypto.randomUUID(),
    Title,
    genre,
    Year,
    Runtime,
    Poster,
  };
  movies.push(newMovie);
  res.status(201).json(newMovie);
});

//Recurso para actualizar datos de una pelicula
app.patch('/movies/:id', (req, res) => {
  const { id } = req.params;
  const movie = movies.findIndex((elem) => elem.id === id);

  if (movie === -1) return res.status(404).json({ message: 'Movie not found' });
});
//Recurso que se identifica con "/movies/:id" para filtrar por genero

/* app.get('/pokemon/ditto', (req, res) => {
  res.json(ditto);
});

app.post('/pokemon', (req, res) => {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    const data = JSON.parse(body);
    data.timestamp = Date.now();
    res.status(201).json(data);
  });
}); */

app.use((req, res) => {
  res.status(404).send('<h1>404 Not Found</h1>');
});

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});
