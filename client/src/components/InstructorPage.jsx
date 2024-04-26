import React, { useState, useEffect } from 'react';

const InstructorPage = () => {
  // State for the classes the instructor is teaching
  const [taughtClasses, setTaughtClasses] = useState([]);

  // Effect to fetch classes taught by the instructor from the database
  useEffect(() => {
    // Assuming you have a function to fetch classes taught by the instructor from your backend
    fetchTaughtClasses()
      .then(classes => setTaughtClasses(classes))
      .catch(error => console.error('Error fetching taught classes:', error));
  }, []);

  // Function to fetch classes taught by the instructor from the database
  const fetchTaughtClasses = async () => {
    // Fetch taught classes from your backend
    // Example fetch code:
    // const response = await fetch('/api/taught-classes');
    // const data = await response.json();
    // return data;

    
    return [
      { id: 1, name: 'Introduction to Computer Science' },
      { id: 2, name: 'Advanced Physics' },
      { id: 3, name: 'Literature and Composition' }
    ];
  };

  return (
    <div>
      <h1>Instructor Page</h1>
      <div>
        <h2>Taught Classes</h2>
        <ul>
          {taughtClasses.map((cls) => (
            <li key={cls.id}>{cls.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InstructorPage;