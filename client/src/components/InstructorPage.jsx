import React, { useState } from 'react';

const InstructorPage = () => {

    

    const classes = [
        { id: 1, name: 'Mathematics', students: ['John Doe', 'Jane Smith'] },
        { id: 2, name: 'Science', students: ['Alice Brown', 'Bob White'] },
    ];

    const [selectedStudents, setSelectedStudents] = useState([]);

    const handleClassClick = (students) => {
        setSelectedStudents(students);
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-3">Instructor</h1>
            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            Classes
                        </div>
                        <ul className="list-group list-group-flush">
                            {classes.map(cls => (
                                <li className="list-group-item list-group-item-action" key={cls.id} onClick={() => handleClassClick(cls.students)}>
                                    {cls.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            Students
                        </div>
                        <ul className="list-group list-group-flush">
                            {selectedStudents.map(student => (
                                <li className="list-group-item" key={student}>
                                    {student}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructorPage;
