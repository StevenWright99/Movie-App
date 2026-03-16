import React, { useEffect, useState } from 'react'
import './App.css'
import Search from './components/Search'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard'
// import { useDebounce } from 'react-use'
import useDebounce from 'react-use/lib/useDebounce'
import { updateSearchCount } from './appwrite'

// API = Application Programming Interface - a set of rules 
// that allows one software application to talk to another
const API_BASE_URL = 'https://api.themoviedb.org/3'

// Must have same name you gave in .env.local
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}


const App = () => {

  // Establishing variable that will be updated by useState
  const [searchTerm, setSearchTerm] = useState('')

  // Displaying error in browser
  const [errorMessage, setErrorMessage] = useState('')

  // UseState for list of movies
  const [movieList, setMovieList] = useState([])

  // This is for displaying loading icon or whatever while data is being fetched
  // Good bc don't want user confused as to what's happening in the seconds it takes to fetch data
  const [isLoading, setIsLoading] = useState(false);

  // DEBOUNCING!! ~ When you serach, you only want request sent after finishing typing
  // as opposed to after every key press. Saves the application a lot of work!
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  // Instead of passing the search term, which would be sent after every keystroke...
  // We instead pass the debouncedSearchTerm, which has a delay of 500ms after typing
  useDebounce( ()=> setDebouncedSearchTerm(searchTerm), 800, [searchTerm])

  // When you are fetching something, it's good practice to use try/catch
  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    // if query exists, we have one call, else we have another
    try {
      const endpoint = query
      // encodeURIComponent ensures that if search term has weird characters they are converted into a standardized something or another so the results you want acctually show up
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      // ~ ~ Parsing response into json object

      // If response is NOT ok
      if (!response.ok) {
        throw new Error('Failed to fetch movies')
      }

      // If response is OK
      const data = await response.json();


      // Console log data
      console.log(data)


      // If data collection fails...
      if (data.response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies')
        setMovieList([]);
        return;
      }


      // If data collection succeeds...
      setMovieList(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0])
      }


    } catch (error) {
      console.error(`Error fetching movies: ${error}`)
      setErrorMessage('Error fetching movies. Try again later')
    } finally {
      // If we succeed, movies are shown
      // If we fail, error is shown
      // No need to show loading state
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <main>
      <div className='pattern' />

      <div className='wrapper'>

        {/* Simple header (img + some inviting text) */}
        <header>
          <img src="./hero-img.png" alt="hero banner" />
          <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Watching Without the Hassle</h1>

          {/* 1st Component - The Search Box */}
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          {/* This displays what we type in the search as an h1 element */}
          {/* just a check to ensure what we type is actually being kept track of */}
          {/* <h1 className='text-white'>{searchTerm}</h1> */}
        </header>
        <section className='all-movies'>
          <h2 className='mt-[40px]'>All Movies</h2>

          {/* check if data is currently loading */}
          {/* If so... display p-tag */}
          {isLoading ? (
            <Spinner />
            // else if not loading, check if error message exists.
            // If so render another p - tag with dynamic error message
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
            // NOT loading, NOT showing error message - display unordered list 
          ) : (
            <ul>
              {movieList.map((movie) => (
                // When mapping over list of elements, add a key that is unique to each element
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}

        </section>

      </div>
    </main>
  )
}

export default App