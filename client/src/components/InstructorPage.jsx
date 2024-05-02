import React, { useState } from 'react';

const InstructorPage = () => {
    // Mock data for classes and students
    const classes = [
        { id: 1, name: 'Mathematics', students: ['John Doe', 'Jane Smith'] },
        { id: 2, name: 'Science', students: ['Alice Brown', 'Bob White'] },
        // Add more classes as needed
    ];

    // State for selected students
    const [selectedStudents, setSelectedStudents] = useState([]);

    // Function to handle class click
    const handleClassClick = (students) => {
        setSelectedStudents(students);
    };

    return (
        <div style={{ margin: '20px' }}>
            <h1>Instructor</h1>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ width: '45%', marginRight: '10%', border: '1px solid black', padding: '10px' }}>
                    <h2>Classes</h2>
                    <ul>
                        {classes.map(cls => (
                            <li key={cls.id} onClick={() => handleClassClick(cls.students)} style={{ cursor: 'pointer' }}>
                                {cls.name}
                            </li>
                        ))}
                    </ul>
                </div>
                <div style={{ width: '45%', border: '1px solid black', padding: '10px' }}>
                    <h2>Students</h2>
                    <ul>
                        {selectedStudents.map(student => (
                            <li key={student}>
                                {student}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default InstructorPage;
