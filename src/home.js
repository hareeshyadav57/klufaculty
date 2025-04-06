import React, { useEffect, useState } from 'react';
import './home.css';

function Home() {
  const [faculties, setFaculties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const facultiesPerPage = 16;

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response = await fetch('http://localhost:5000/faculties');
        const data = await response.json();
        setFaculties(data);
      } catch (error) {
        console.error('Error fetching faculty data:', error);
      }
    };

    fetchFaculties();
  }, []);

  const departments = ['All', ...new Set(faculties.map(faculty => faculty.department))];

  const filteredFaculties = faculties.filter(faculty =>
    (faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.specialization.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedDepartment === 'All' || selectedDepartment === '' || faculty.department === selectedDepartment)
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDepartment]);

  const indexOfLastFaculty = currentPage * facultiesPerPage;
  const indexOfFirstFaculty = indexOfLastFaculty - facultiesPerPage;
  const currentFaculties = filteredFaculties.slice(indexOfFirstFaculty, indexOfLastFaculty);
  const totalPages = Math.ceil(filteredFaculties.length / facultiesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const pageNumbers = [];
  const startPage = Math.max(1, currentPage - 5);
  const endPage = Math.min(totalPages, startPage + 9);

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <header className="header">
        <h1>KLU Faculty Feedback System</h1>
        <nav>
          <a href="#home">Home</a>
          <a href="#login">Login</a>
        </nav>
      </header>

      <main className="main-content">
        <h2>Faculty Details</h2>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="branch-select"
          >
            {departments.map((dept, index) => (
              <option key={index} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div className="faculty-list" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {currentFaculties.map((faculty) => (
            <div className="faculty-card" key={faculty.id}>
              <img src={faculty.imageUrl} alt={faculty.name} className="faculty-image" />
              <h3>{faculty.name}</h3>
              <p>Department: {faculty.department}</p>
              <p>Position: {faculty.position}</p>
              <p>Email: {faculty.email}</p>
              <p>Phone: {faculty.phone}</p>
              <p>Office: {faculty.office}</p>
              <p>Specialization: {faculty.specialization}</p>
            </div>
          ))}
        </div>

        <div className="pagination">
          {currentPage > 1 && <button onClick={handlePrev}>←</button>}
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={currentPage === number ? 'active' : ''}
            >
              {number}
            </button>
          ))}
          {currentPage < totalPages && <button onClick={handleNext}>→</button>}
        </div>
      </main>

      <footer className="footer">
        <p>Useful Links:</p>
        <a href="https://www.kluniversity.in" target="_blank" rel="noopener noreferrer">KLU Website</a>
        <a href="https://newerp.kluniversity.in" target="_blank" rel="noopener noreferrer">ERP Website</a>
        <a href="https://lms.kluniversity.in" target="_blank" rel="noopener noreferrer">LMS Website</a>
      </footer>
    </div>
  );
}

export default Home;
