import React, { useEffect, useState } from 'react';
import { GetGenres } from '../../services/APIRoutes';
import SongList from '../common/SongList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export default function Search() {

    const [genres, setGenres] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState(null);

    useEffect(() => {
        fetchGenres();
    }, []);

    const fetchGenres = async () => {
        setError(null);
        try {
            const token = localStorage.getItem('userToken');
            const response = await fetch(GetGenres, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });
            const data = await response.json();
            setGenres(data.data);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleGenreClick = (genre) => {
        setSelectedGenre(genre.value);
    };

    return (
        <div className="p-4 flex" style={{minHeight: "500px"}}>
            <div className="w-1/2">
                <h3 className='mb-5'>Genres</h3>
                {error && <p className="text-red-500">{error}</p>}
                <div className="grid grid-cols-3 gap-4">
                    {genres.length > 0 ? (
                        genres.map((genre) => (
                            <div
                                key={genre.value}
                                className={`bg-red-600 shadow-red rounded-lg p-4 cursor-pointer ${selectedGenre === genre.value ? 'bg-white' : ''}`}
                                onClick={() => handleGenreClick(genre)}
                            >
                                <h3 className="text-xl font-semibold text-black">{genre.label}</h3>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No genres found</p>
                    )}
                </div>
            </div>
            <div className="w-1/2 pl-4">
                <div className="flex justify-between items-center mb-4">
                    <h3>Songs</h3>
                    <div className="relative">
                        <input
                            type="text"
                            className="pl-10 pr-4 py-2 rounded bg-black text-white placeholder-gray-400"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <FontAwesomeIcon icon={faSearch} className="absolute left-0 top-0 mt-3 ml-2 text-gray-400" />
                    </div>
                </div>
                {selectedGenre ? (
                    <SongList searchTerm={searchTerm} page={"search"} filterGenre={selectedGenre} />
                ) : (
                    <p className="text-center text-gray-500">No song found</p>
                )}
            </div>
        </div>
    );
}
