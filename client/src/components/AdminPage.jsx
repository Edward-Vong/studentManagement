// src/components/ClassesList.js
import React, { useState, useEffect } from 'react';

const AdminPage = () => {
    const [classes, setClasses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const classesPerPage = 10;

    useEffect(() => {
        // Dummy data generation
        const dummyData = Array.from({ length: 100 }, (_, index) => ({
        id: index + 1,
        name: `Class ${index + 1}`
        }));
        setClasses(dummyData);
    }, []);

    const indexOfLastClass = currentPage * classesPerPage;
    const indexOfFirstClass = indexOfLastClass - classesPerPage;
    let filteredClasses = classes.filter((classItem) =>
        classItem.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const currentClasses = filteredClasses.slice(indexOfFirstClass, indexOfLastClass);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleDelete = (id) => {
        // Dummy delete function
        setClasses(classes.filter((classItem) => classItem.id !== id));
    };

    const handleEdit = (id) => {
        // Dummy edit function
        console.log(`Editing class with id: ${id}`);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset page thing when search changes
    };

    return (
        <div className="container mx-auto mt-8">

            <h2 className="text-2xl font-bold mb-4">Classes</h2>

            <div className="mb-4">
                <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search for a class..."
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        
            <ul>
                {currentClasses.map((classItem) => (

                <li key={classItem.id} className="py-2 flex items-center justify-between">
                    
                    <span>{classItem.name}</span>

                    <div>

                        <button
                            onClick={() => handleEdit(classItem.id)}
                            className="px-3 py-1 mr-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                            Edit
                        </button>
                        
                        <button
                            onClick={() => handleDelete(classItem.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">
                            Delete
                        </button>

                    </div>

                </li>
                ))}

            </ul>

            <Pagination
                itemsPerPage={classesPerPage}
                totalItems={filteredClasses.length}
                paginate={paginate}
                currentPage={currentPage} />

        </div>
    );
};

    const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav className="mt-4" aria-label="Pagination">

            <ul className="flex space-x-2">

                {pageNumbers.map((number) => (

                <li key={number}>
                    <button
                    onClick={() => paginate(number)}
                    className={`px-3 py-1 rounded-md ${
                        currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                    } hover:bg-blue-600 hover:text-white`} >

                    {number}

                    </button>

                </li>
                ))}

            </ul>

        </nav>
    );
};

export default AdminPage;
