import React, {useState, useEffect} from 'react'
import './Main.css'


function Main() {
    let [isFetching, setisFetching] = useState(false)
    let [results, setResults] = useState([])
    let [selected, setSelected] = useState([])

    useEffect(() => {
        const savedNoms = JSON.parse(window.localStorage.getItem('savedNoms'))
        if (savedNoms) {
            setSelected(savedNoms)
        }
    }, [])

    let getResults = (e) => {
        if (e.key === 'Enter') {
            setisFetching(true)
            fetch(`http://www.omdbapi.com/?s=${e.target.value}&apikey=21c815d1&type=movie`, {method: 'get'}).then(
                (response) => response.json()
                ).then(body => setResults(body.Search))
        }
    }

    let saveNominations = (movie) => {
        let newSelected = selected.concat(movie)
        setSelected(newSelected)
        window.localStorage.setItem('savedNoms', JSON.stringify(newSelected))
    }

    return (
        <main>
            <div className='title'>
                <h1>The Shoppies</h1>
                <h2>Movie Awards For Entrepreneurs</h2>
                <div className='container search' style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gridArea: 'search'}}>
                    <input className='searchbar' type='text' placeholder='Search for a movie..' onKeyPress={getResults}/>
                </div>
            </div>
            <div className='results' style={{gridArea: 'results'}}>
                <h1>Results</h1>
                <div className='resultsGrid'>
                    {results.map((result) => 
                        <div className='galleryItem'>
                            <span className='hoverText'>Nominate</span>
                            <div className='movieDetail' onClick={() => saveNominations(result.Title)}>
                                <img className='moviePoster' src={result.Poster} alt={result.Title}/>
                                <h3>{result.Title}</h3>
                            </div>
                        </div>)}
                </div>
            </div>
            <div className='nominations' style={{gridArea: 'nominations'}}>
                <h1>Your Nominations</h1>
                <div className='nominationList'>
                    {selected.map((selection) => <div><span className='movieTitle'>{selection}</span><span>X</span></div>)}
                </div>
            </div>
        </main>
    )
}

export default Main