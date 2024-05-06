import React, { useState, useEffect } from 'react';

const InstructorPage = () => {
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedCourseName, setSelectedCourseName] = useState('');
    const [selectedCourseDetails, setSelectedCourseDetails] = useState(null);

    const instructorId = localStorage.getItem('id');

    useEffect(() => {
        if (instructorId) {
            fetchCourses(instructorId);
        } else {
            console.error('No instructor ID found in local storage.');
        }
    }, [instructorId]);

    const fetchCourses = async (instructorId) => {
        try {
            const url = `http://localhost:3000/instructor-courses/${instructorId}`;
            const response = await fetch(url);
            const data = await response.json();
            if (response.ok) {
                setCourses(data.courses);
            } else {
                throw new Error('Failed to fetch courses: ' + data.message);
            }
        } catch (error) {
            console.error('Error fetching courses:', error.message);
        }
    };

    const handleCourseClick = async (courseId, courseName) => {
        setSelectedCourseName(courseName);
        const selectedCourse = courses.find(course => course.CourseID === courseId);
        setSelectedCourseDetails(selectedCourse);

        try {
            const enrollmentResponse = await fetch(`http://localhost:3000/enrollments?courseId=${courseId}`);
            const enrollments = await enrollmentResponse.json();
            if (enrollmentResponse.ok) {
                const studentDetails = await Promise.all(
                    enrollments.map(async enrollment => {
                        const response = await fetch(`http://localhost:3000/students/${enrollment.StudentID}`);
                        if (response.ok) {
                            const student = await response.json();
                            student.EnrollmentID = enrollment.EnrollmentID;
                            return student;
                        } else {
                            throw new Error('Failed to fetch student details');
                        }
                    })
                );
                setStudents(studentDetails.filter(student => student));
            } else {
                throw new Error('Failed to fetch enrollments: ' + enrollments.message);
            }
        } catch (error) {
            console.error('Error handling course click:', error.message);
        }
    };

    const handleUnenroll = async (enrollmentId) => {
        try {
            const response = await fetch(`http://localhost:3000/enrollments/${enrollmentId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                alert('Student unenrolled successfully!');
                const updatedStudents = students.filter(student => student.EnrollmentID !== enrollmentId);
                setStudents(updatedStudents);
            } else {
                throw new Error('Failed to unenroll student');
            }
        } catch (error) {
            console.error('Error unenrolling student:', error.message);
            alert('Error unenrolling student: ' + error.message);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-3">Instructor Dashboard</h1>
            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">Courses</div>
                        <ul className="list-group list-group-flush">
                            {courses.map(course => (
                                <li className="list-group-item list-group-item-action" key={course.CourseID} onClick={() => handleCourseClick(course.CourseID, course.CourseName)}>
                                    {course.CourseName}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="col-md-6">
                    {selectedCourseDetails && (
                        <div className="card mb-3">
                            <div className="card-header">Course Details</div>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">Start Time: {selectedCourseDetails.StartTime}</li>
                                <li className="list-group-item">End Time: {selectedCourseDetails.EndTime}</li>
                                <li className="list-group-item">Days: {selectedCourseDetails.DaysOfWeek}</li>
                                <li className="list-group-item">Room ID: {selectedCourseDetails.RoomID}</li>
                            </ul>
                        </div>
                    )}
                    <div className="card">
                        <div className="card-header">Students in {selectedCourseName}</div>
                        <ul className="list-group list-group-flush">
                            {students.map((student, index) => (
                                <li className="list-group-item d-flex justify-content-between align-items-center" key={student.UserID || index}>
                                    <div className="text-center flex-grow-1">{student.FirstName} {student.LastName} - {student.Email}</div>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleUnenroll(student.EnrollmentID)}>
                                        Remove
                                    </button>
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
