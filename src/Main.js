import React, {useState, useEffect} from 'react'
import {CSSTransition, TransitionGroup} from 'react-transition-group'
import {ScaleLoader} from 'react-spinners'
import './Main.css'


function Main() {
    const [isFetching, setIsFetching] = useState(false)
    const [results, setResults] = useState([])
    const [selected, setSelected] = useState([])
    const [isError, setIsError] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const savedNoms = JSON.parse(window.localStorage.getItem('savedNoms'))
        if (savedNoms) {
            setSelected(savedNoms)
        }
    }, [])

    let getResults = (e) => {
        if (e.key === 'Enter' && e.target.value !== searchTerm) {
            setIsFetching(true)
            setSearchTerm(e.target.value)
            setResults([])
            fetch(`https://www.omdbapi.com/?s=${e.target.value}&apikey=21c815d1&type=movie`, {method: 'get'}).then(
                (response) => response.json()
                ).then(body => setTimeout(() => {
                                if (body.Error) {
                                    setResults([])
                                    setIsFetching(false)
                                    setIsError(true)
                                }
                                else {
                                    setResults(body.Search)
                                    setIsFetching(false)
                                    setIsError(false)}
                                }, 200)
                                
                ).catch((e) => console.log(e))
        }
    }

    let saveNominations = (movie) => {
        if (selected.length === 5) {
            window.alert('Five movies have already been nominated.')
        }
        else {
            if (selected.indexOf(movie) === -1) {
                let newSelected = selected.concat(movie)
                if (newSelected.length === 5) {
                    window.alert('You have nominated five movies!')
                }
                setSelected(newSelected)
                window.localStorage.setItem('savedNoms', JSON.stringify(newSelected))
            }
            else {
                window.alert('Movie has already been nominated.')
            }
        }
    }

    let removeNomination = (index) => {
        // Use Array.filter to return new array instead of splice for synchronous updates
        let reducedSelected = selected.filter((element, i) => i !== index)
        setSelected(reducedSelected)
        window.localStorage.setItem('savedNoms', JSON.stringify(reducedSelected))
    }

    return (
        <main>
            <div className='title'>
                <h1>The Shoppies Nominations</h1>
                <h2><i>Movie Awards For Entrepreneurs</i></h2>
                <div className='container search' style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gridArea: 'search'}}>
                    <input className='searchbar' type='text' placeholder='Search for a movie..' onKeyPress={getResults}/>
                    <span>
                        <svg className="searchIcon" viewBox="0 0 20 20">
                            <path d="M18.125,15.804l-4.038-4.037c0.675-1.079,1.012-2.308,1.01-3.534C15.089,4.62,12.199,1.75,8.584,1.75C4.815,1.75,1.982,4.726,2,8.286c0.021,3.577,2.908,6.549,6.578,6.549c1.241,0,2.417-0.347,3.44-0.985l4.032,4.026c0.167,0.166,0.43,0.166,0.596,0l1.479-1.478C18.292,16.234,18.292,15.968,18.125,15.804 M8.578,13.99c-3.198,0-5.716-2.593-5.733-5.71c-0.017-3.084,2.438-5.686,5.74-5.686c3.197,0,5.625,2.493,5.64,5.624C14.242,11.548,11.621,13.99,8.578,13.99 M16.349,16.981l-3.637-3.635c0.131-0.11,0.721-0.695,0.876-0.884l3.642,3.639L16.349,16.981z"></path>
                        </svg>
                    </span>
                </div>
            </div>
            <div className='results'>
                {results.length === 0 && searchTerm === '' ? <h1>Results will show here!</h1> : <h1>Searched for '<i>{searchTerm}</i>'</h1>}
                <ScaleLoader loading={isFetching} css={{textAlign: 'center'}}/>
                {isError && <h2>No results were found/Search term was too short.</h2>}
                <div className='resultsGrid'>
                    <TransitionGroup component={null}>
                    {results.map((result, i) => 
                        <CSSTransition timeout={200} classNames='fadeIn'>
                            <div className='galleryItem' key={i} style={{transitionDelay: `${i + 1}00ms`}}>
                                <span className='hoverText'>Nominate</span>
                                <div className='movieDetail' onClick={() => saveNominations(result.Title)}>
                                    <img className='moviePoster' src={result.Poster} alt={result.Title}/>
                                    <h3>{result.Title} ({result.Year})</h3>
                                </div>
                            </div>
                        </CSSTransition>)}
                    </TransitionGroup>
                </div>
            </div>
            <div className='nominations'>
                <h1>Your Nominations</h1>
                <div className='nominationList'>
                    {selected.map((selection, index) => <div><span className='movieTitle'>{selection}</span><span className='delete' onClick={() => removeNomination(index)}>Remove</span></div>)}
                </div>
            </div>
        </main>
    )
}

export default Main