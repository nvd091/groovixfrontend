import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { AddAlbum, AddArtist, AddGenre, DeleteAlbum, DeleteArtist, DeleteGenre, EditAlbum, EditArtist, EditGenre, GetAlbums, GetArtists, GetGenres } from '../../services/APIRoutes';
import DataModal from '../modals/DataModal';

const DataSection = ({ title, endpoint, editendpoint, deleteendpoint, addendpoint }) => {
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState('');
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [newName, setNewName] = useState('');
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        fetchData();
    }, [search]);

    const fetchData = async () => {
        setError(null);
        try {
            const token = localStorage.getItem('userToken');
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ search })
            });
            const data = await response.json();
            setItems(data.data);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleEdit = async (id, newData) => {
        try {
            const token = localStorage.getItem('userToken');
            await fetch(`${editendpoint}/${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newData),
            });
            fetchData();
            setShowModal(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('userToken');
            await fetch(`${deleteendpoint}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            fetchData();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAdd = async (newData) => {
        try {
            const token = localStorage.getItem('userToken');
            await fetch(addendpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newData),
            });
            fetchData();
            setShowModal(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const openEditModal = (item) => {
        setCurrentItem(item);
        setNewName(item.label);
        setIsEdit(true);
        setShowModal(true);
    };

    const openAddModal = () => {
        setCurrentItem(null);
        setNewName('');
        setIsEdit(false);
        setShowModal(true);
    };

    return (
        <div className="flex flex-col flex-1 p-4 border-b border-gray-200 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            <button
                onClick={openAddModal}
                className="bg-red-600 hover:bg-red-500 text-white py-2 my-2 w-20 rounded"
            >
                Add
            </button>
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${title}`}
                className="mb-4 p-2 rounded w-full bg-black text-white placeholder-gray-400 shadow-red"
            />
            {error && <p className="text-red-500">{error}</p>}
            <ul className="space-y-2">
                {items.map(item => (
                    <li key={item.value} className="flex justify-between items-center p-2 border-b border-b-red-600">
                        {item.label}
                        <div>
                            <FontAwesomeIcon
                                icon={faEdit}
                                onClick={() => openEditModal(item)}
                                className="ml-2 p-1 cursor-pointer"
                            />
                            <FontAwesomeIcon
                                icon={faTrashAlt}
                                onClick={() => handleDelete(item.value)}
                                className="ml-2 p-1 cursor-pointer"
                            />
                        </div>
                    </li>
                ))}
            </ul>

            <DataModal show={showModal} onClose={() => setShowModal(false)}>
                <h2 className="text-xl mb-4">{isEdit ? `Edit ${title}` : `Add ${title}`}</h2>
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="mb-4 p-2 rounded w-full bg-black text-white placeholder-gray-400 shadow-red"
                />
                <button
                    onClick={() => isEdit ? handleEdit(currentItem.value, { name: newName }) : handleAdd({ name: newName })}
                    className="p-2 bg-red-600 text-white rounded"
                >
                    Save
                </button>
            </DataModal>
        </div>
    );
};

export default function Data() {
    return (
        <div className="flex flex-row v-screen">
            <DataSection title="Artists" endpoint={GetArtists} deleteendpoint={DeleteArtist} editendpoint={EditArtist} addendpoint={AddArtist} />
            <DataSection title="Albums" endpoint={GetAlbums} deleteendpoint={DeleteAlbum} editendpoint={EditAlbum} addendpoint={AddAlbum} />
            <DataSection title="Genres" endpoint={GetGenres} deleteendpoint={DeleteGenre} editendpoint={EditGenre} addendpoint={AddGenre} />
        </div>
    );
}
