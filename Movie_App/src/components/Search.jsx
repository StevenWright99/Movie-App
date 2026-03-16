import React from 'react'

// This component contains the search button and other things

// We pass in searchTerm ans setSearchTerm as props
const Search = ({ searchTerm, setSearchTerm }) => {
    return (

        // This div contains the search box image and the text we type in
        <div className='search'>
            <div>
                <img src="Search-Input.png" alt="search" />

                <input
                    type="text"
                    placeholder='Search thousands of movies'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
    )
}

export default Search