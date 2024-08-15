import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { AddPlaylist, CreatePlaylist, GetPlaylists, GetSongList, DeletePlaylist, GetComments, LikeSong, UnlikeSong, AddComment, RemovePlaylist } from '../../services/APIRoutes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faClose } from '@fortawesome/free-solid-svg-icons';
import SongDetailModal from '../modals/SongDetailModal';

export default function Playlist() {
  const [playlists, setPlaylists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [songModalIsOpen, setSongModalIsOpen] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalType, setModalType] = useState('');
  const [error, setError] = useState('');
  const [expandedPlaylistId, setExpandedPlaylistId] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);
  const [commentText, setCommentText] = useState('');


  useEffect(() => {
    fetchPlaylists();
  }, []);

  useEffect(() => {
    if (selectedPlaylistId) {
      fetchSongs();
    }
  }, [searchTerm]);

  const fetchPlaylists = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(GetPlaylists, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      const data = await response.json();
      setPlaylists(data.playlists);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const handleCreatePlaylist = async () => {
    try {
      if (!newPlaylistName) {
        setError('Playlist name is required');
        return;
      }
      const token = localStorage.getItem('userToken');
      const response = await fetch(CreatePlaylist, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newPlaylistName })
      });
      const data = await response.json();
      setPlaylists([data.playlist, ...playlists]);
      setNewPlaylistName('');
      setModalIsOpen(false);
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  const handleOpenModal = async (playlistId) => {
    setSelectedPlaylistId(playlistId);
    setSelectedSongs([]);
    setModalType('addSongs');
    fetchSongs();
  };

  const handleOpenCreateModal = () => {
    setModalType('createPlaylist');
    setModalIsOpen(true);
  };

  const fetchSongs = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(GetSongList, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ search: searchTerm })
      });
      const data = await response.json();
      setSongs(data.songs);
      setModalIsOpen(true);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const handleAddSongsToPlaylist = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(AddPlaylist, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ playlistId: selectedPlaylistId, songIds: selectedSongs })
      });
      const data = await response.json();
      setPlaylists(playlists.map(playlist => playlist._id === selectedPlaylistId ? data.playlist : playlist));
      setSelectedSongs([]);
      setModalIsOpen(false);
    } catch (error) {
      console.error('Error adding songs to playlist:', error);
    }
  };

  const handleRemoveSongFromPlaylist = async (playlistId, songId) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(RemovePlaylist, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playlistId, songId }),
      });
  
      if (response.ok) {
        setPlaylists(playlists.map(playlist => {
          if (playlist._id === playlistId) {
            return {
              ...playlist,
              song: playlist.song.filter(song => song._id !== songId),
            };
          }
          return playlist;
        }));

      } else {
        const data = await response.json();
        console.error('Error removing song from playlist:', data.error);
      }
    } catch (error) {
      console.error('Error removing song from playlist:', error);
    }
  };  

  const handleDeletePlaylist = async (playlistId) => {
    try {
      const token = localStorage.getItem('userToken');
      await fetch(`${DeletePlaylist}/${playlistId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      setPlaylists(playlists.filter(playlist => playlist._id !== playlistId));
    } catch (error) {
      console.error('Error deleting playlist:', error);
    }
  };

  const toggleSongSelection = (songId) => {
    if (selectedSongs.includes(songId)) {
      setSelectedSongs(selectedSongs.filter(id => id !== songId));
    } else {
      setSelectedSongs([...selectedSongs, songId]);
    }
  };

  const toggleExpandPlaylist = (playlistId) => {
    if (expandedPlaylistId === playlistId) {
      setExpandedPlaylistId(null);
    } else {
      setExpandedPlaylistId(playlistId);
    }
  };

  const openModal = async (song) => {
    const comments = await fetchComments(song._id);
    setSelectedSong({ ...song, comments });
    setSongModalIsOpen(true);
  };

  const closeModal = () => {
    setSongModalIsOpen(false);
    setSelectedSong(null);
  };

  const fetchComments = async (songId) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${GetComments}/${songId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      const data = await response.json();
      return data.comments;
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async (song) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${song.liked === true ? UnlikeSong : LikeSong}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: song._id })
      });
      if (response.ok) {
        const updatedSongs = songs.map(s => s._id === song._id ? { ...s, liked: !s.liked } : s);
        setSongs(updatedSongs);        
        if(selectedSong?._id === song?._id) {
          setSelectedSong({ ...selectedSong, liked: !selectedSong.liked });
        }
      } else {
        const data = await response.json();
        console.error('Error updating song like status:', data.error);
      }
    } catch (error) {
      console.error('Error updating song like status:', error);
    }
  };

  const handleAddComment = async () => {
    if (commentText.trim() === '') return;

    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(AddComment, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ song: selectedSong._id, message: commentText })
      });
      const data = await response.json();
      if (response.ok) {
        setSelectedSong((selectedSong) => ({
          ...selectedSong,
          comments: selectedSong.comments ? [data.comment, ...selectedSong.comments] : [data.comment]
        }));
        setCommentText('');
      } else {
        console.error('Error adding comment:', data.error);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }

  };

  return (
    <div className="p-4" style={{minHeight:"600px"}}>
      <button
        className="bg-red-600 hover:bg-red-500 text-white px-4 py-2"
        onClick={handleOpenCreateModal}
      >
        Add Playlist
      </button>

      <h3 className="mt-4 mb-4">Playlists</h3>

      <div className="space-y-2">
        {playlists.length > 0 ? (
          playlists.map(playlist => (
            <div key={playlist._id} className="flex flex-col items-start p-2 bg-black shadow-red text-white rounded">
              <div className="flex justify-between w-full">
                <span
                  className='text-red-500 cursor-pointer'
                  onClick={() => toggleExpandPlaylist(playlist._id)}
                >
                  {playlist.name}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenModal(playlist._id);
                    }}
                  >
                    <FontAwesomeIcon icon={faPlus} className="block h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => handleDeletePlaylist(playlist._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} className="block h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
              {expandedPlaylistId === playlist._id && (
                <div className="mt-2">
                  {playlist.song ? (
                      <div className="flex flex-wrap gap-4 m-3">
                          {playlist.song.length > 0 ? (
                            playlist.song.map((song) => (
                              <div
                                key={song._id}
                                className="w-36 cursor-pointer text-center shadow-red bg-black"
                                style={{ height: "220px" }}
                                onClick={() => openModal(song)}
                              >
                                <img src={song.coverImage} alt={song.title} className="w-full h-auto" />
                                <h3
                                  className="mt-2 text-white"
                                  style={{ height: "40px", overflow: "hidden", fontSize: "12px" }}
                                >
                                  {song.title}
                                </h3>
                                <FontAwesomeIcon
                                  icon={faClose}
                                  className="cursor-pointer float-right mr-3"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveSongFromPlaylist(playlist._id, song._id);
                                  }}
                                />
                              </div>
                            ))
                          ) : (
                            <div className="w-full text-center text-white">No songs found</div>
                          )}
                      </div>
                  ) : (
                    <p>No songs in this playlist.</p>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="w-full text-center text-white">No playlists found</div>
        )}
      </div>

      <Modal
        id="playlistmodal"
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="bg-black p-4 rounded shadow-red mx-auto mt-20 w-3/4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
      >
        {modalType === 'createPlaylist' ? (
          <>
            <h2 className="text-lg text-red-600 mb-4">Create New Playlist</h2>
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="w-full p-2 mb-4 bg-black text-white rounded shadow-red"
              placeholder="Playlist Name"
            />
            <div className="text-sm text-red-600 mb-2">{error}</div>
            <button
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 text-sm"
              onClick={handleCreatePlaylist}
            >
              Create Playlist
            </button>
          </>
        ) : (
          <>
            <h2 className="text-lg text-red-600 mb-4">Add Songs to Playlist</h2>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 mb-4 bg-black text-white rounded shadow-red text-sm"
              placeholder="Search Songs"
            />
            <div className="max-h-96 overflow-y-auto">
              {songs.map(song => (
                <div key={song._id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={song._id}
                    checked={selectedSongs.includes(song._id)}
                    onChange={() => toggleSongSelection(song._id)}
                    className="mr-2"
                  />
                  <label htmlFor={song._id} className="text-white">{song.title}</label>
                </div>
              ))}
            </div>
            <button
              onClick={handleAddSongsToPlaylist}
              className="mt-4 bg-red-600 text-white py-2 px-4 rounded"
            >
              Add Selected Songs
            </button>
          </>
        )}
      </Modal>

      <SongDetailModal
        isOpen={songModalIsOpen}
        onRequestClose={closeModal}
        song={selectedSong}
        handleLike={handleLike}
        commentText={commentText}
        setCommentText={setCommentText}
        handleAddComment={handleAddComment}
      />

    </div>
  );
}
