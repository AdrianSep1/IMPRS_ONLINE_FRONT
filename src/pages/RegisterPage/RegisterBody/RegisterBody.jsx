import './registerbody.css';
import React, { useState } from 'react';
import { FaLock, FaUser } from 'react-icons/fa';
import { HiIdentification } from "react-icons/hi2";
import { HiAtSymbol } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { BiSolidBuildingHouse } from "react-icons/bi";

const RegisterBody = () => {
    const [alert, setAlert] = useState('hide');
    const [alertMsg, setAlertMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const [adminVerified, setAdminVerified] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [schoolId, setSchoolId] = useState('');
    const [role, setRole] = useState('');
    const [department, setDepartment] = useState('');
    const navigate = useNavigate();
    const [employeeType, setEmployeeType] = useState('');
    const [college, setCollege] = useState('');
    const [office, setOffice] = useState('');

    const academicColleges = {
        'College of Arts and Science Education (CASE)': [
            'Department of Humanities and Behavioral Sciences (DHBS)',
            'Department of Language, Literature and Communication (DLLC)',
            'Department of Mathematics and Natural Sciences (DMNS)',
            'Physical Education',
            'Teacher – Education',
        ],
        'College of Computer Studies (CCS)': [
            'Computer Science Department',
            'Information Technology Department',
        ],
        'College of Criminal Justice (CCJ)': ['Criminal Justice Department'],
        'College of Engineering and Architecture (CEA)': [
            'Architecture Department',
            'Chemical Engineering Department',
            'Civil Engineering Department',
            'Computer Engineering Department',
            'Electrical Engineering Department',
            'Electronics Engineering Department',
            'Industrial Engineering Department',
            'Mechanical Engineering Department',
            'Mining Engineering Department',
        ],
        'College of Management and Business Accountancy (CMBA)': [
            'Accountancy Department',
            'Business Administration Department',
            'Hospitality and Tourism Management Department',
            'Office Administration Department',
            'Public Administration Department',
        ],
        'College of Nursing and Allied Health Sciences (CNAAHS)': [
            'Nursing Department',
            'Pharmacy Department',
        ],
        'Elementary': [],
        'Junior High School': [],
        'Senior High School': [],
        'University Library': [],
        'Vice Presidents for Academic Affairs': [],
    };

    const administrativeOffices = [
        'Accountancy Office', 'AI Fab Lab', 'Architecture Office', 'Athletics',
        'Business Administration Office', 'Community Extension Service (CES) & National Service Training Program (NSTP)',
        'Chemical Engineering Office', 'Civil Engineering Office', 'Computer Engineering Office', 'Computer Science Office',
        'CREATE', 'Criminal Justice Office', 'CV FIC', 'Dept of Engineering Math, Physics and Chemistry',
        'Dept of Languages, Literature and Communication', 'Dept of Mathematics and Natural Sciences',
        'Electrical Engineering Office', 'Electronics Engineering Office', 'Elementary Office',
        'Enrollment Technical Office', 'Finance Office', 'Guidance Center',
        'Hospitality and Tourism Management Office', 'Human Resources Office (HRO)', 'Humanities & Behavioral Sciences',
        'Instructional Materials and Publication Office (IMPO)', 'Industrial Engineering Office',
        'Information Technology Office', 'JHS and SHS Office', 'Legal & Corporate Affairs Office', 'Library',
        'Marketing Office', 'Medical and Dental Clinic (MDC)', 'Mechanical Engineering Office',
        'Mining Engineering Office', 'MIS & External Affairs Office', 'Multimedia Solutions and Documentation Office (MSDO)',
        'Nursing Office', 'Office of Admission and Scholarship (OAS)', 'Office of Property Custodian (OPC)',
        'Office of the University President', 'Office of the University Vice President', 'Pharmacy Office',
        'Physical Education Office', 'Public Administration Office (PAO)', 'Registrar',
        'Research and Development Coordinating Office (RDCO)', 'SSD', 'Student Success Office (SSO)',
        'Technical Support Group (TSG)', 'Wildcats Innovation Lab (WIL)',
    ];


    const infoPop = (message, isSuccess = false) => {
        setAlert('show');
        setAlertMsg(message);
        setSuccess(isSuccess);
    };

    const closeInfoPop = () => {
        setAlert('hide');
        if (success) {
            navigate('/'); 
        }
    };

    const handleEmployeeType = (e) => {
        const selectedType = e.target.value;
        setEmployeeType(selectedType);

        if (selectedType === 'academic') {
            setRole('Academic');
        } else if (selectedType === 'administrative') {
            setRole('Administrative');
        }
    };
    

    const handleRegister = () => {
        const requestOptionsGET = {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
        };
    
        const requestOptionsPOST = {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const isValidEmail = /^[a-zA-Z0-9._%+-]+@cit\.edu$/;
    
        // Input validations
        if (!firstName || !lastName || !email || !password || !confirmPass || !schoolId || !employeeType) {
            infoPop('All fields are required.');
            return;
        }
    
        // Check if specific fields for the employee type are filled
        if (employeeType === 'faculty' && (!college || !department)) {
            infoPop('Please select both a college and a department.');
            return;
        }
        if (college === 'Elementary' || college === "Junior High School" || college === "Senior High School" || college === "University Library" || college === "Vice President for Academic Affairs"){
            setDepartment(college);
            console.log(department);
        }
        if (employeeType === 'office' && !office) {
            infoPop('Please select an office.');
            return;
        }
    
        if (!email.match(isValidEmail)) {
            infoPop('Please use a valid cit.edu email address to register.');
            return;
        }
    
        if (confirmPass !== password) {
            infoPop('Make sure your passwords match! Try again.');
            return;
        }
        const date = new Date().toISOString();
        // Check for existing email
        fetch(`https://imprsonlineback-production.up.railway.app/services/exists?email=${email}`, requestOptionsGET)
            .then((response) => response.json())
            .then((data) => {
                if (data === true) {
                    infoPop('That email is already in use! Please use another email.');
                } else {
                    // Check for existing school ID
                    fetch(`https://imprsonlineback-production.up.railway.app/services/exists?schoolId=${schoolId}`, requestOptionsGET)
                        .then((response) => response.json())
                        .then((data) => {
                            if (data === true) {
                                infoPop('That School ID is already in use! Please use another School ID.');
                            } else {
                                // Proceed with registration
                                fetch(`https://imprsonlineback-production.up.railway.app/services/NewUserRegistration?firstName=${firstName}&lastName=${lastName}&password=${password}&email=${email}&schoolId=${schoolId}&employeeType=${employeeType}&role=${role}&adminVerified=${adminVerified}&college=${college}&department=${department}&office=${office}&createdDate=${date}`, requestOptionsPOST)
                                    .then((response) => response.json())
                                    .then(() => {
                                        infoPop("Registration successful! Wait for admin's confirmation", true);
                                        // Clear form fields
                                        setFirstName('');
                                        setLastName('');
                                        setPassword('');
                                        setEmail('');
                                        setConfirmPass('');
                                        setSchoolId('');
                                        setRole('');
                                        setDepartment('');
                                        setCollege('');
                                        setOffice('');
                                        setEmployeeType('');
                                    })
                                    .catch(error => {
                                        console.log(error);
                                        infoPop('An error occurred during registration. Please try again.');
                                    });
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            })
            .catch(error => {
                console.log(error);
            });
    };
    
    
    

    return (
        <div className="form-container">
            <div id="infoPopOverlay" className={alert}></div>
            <div id="infoPop" className={alert}>
                <p>{alertMsg}</p>
                <button id="infoChangeBtn" onClick={closeInfoPop}>Close</button>
            </div>
            <form>
                <h2 style={{marginBottom: '4vw'}}>Registration</h2>
                <div className="form-row">
                    {/* First Column */}
                    <div className="column">
                    <label>
                            <FaUser />
                            <input
                                className="regShad"
                                required
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="First Name"
                            />
                        </label>
                        <label>
                            <FaUser />
                            <input
                                className="regInput regShad"
                                required
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Last Name"
                            />
                        </label>
                        <label>
                            <HiAtSymbol id="emailSym" />
                            <input
                                className="regShad"
                                id="emailIn"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                            />
                        </label>
                        <label>
                            <FaLock />
                            <input
                                className="regShad"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                            />
                        </label>
                        <label>
                            <FaLock />
                            <input
                                className="regShad"
                                type="password"
                                value={confirmPass}
                                onChange={(e) => setConfirmPass(e.target.value)}
                                placeholder="Confirm Password"
                            />
                        </label>
                    </div>

                    {/* Second Column */}
                    <div className="column">
                    <label>
                        <HiIdentification />
                        <input
                            className="regShad"
                            type="text"
                            value={schoolId}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                    setSchoolId(value); // Update only if input is numeric
                                }
                            }}
                            placeholder="School ID"
                        />
                    </label>

                        <label htmlFor="employeeType"></label>
                        <select
                                className="regShad"
                                style={{fontSize: '.85em', marginLeft: '1.5vw'}}
                                defaultValue={employeeType} onChange={handleEmployeeType}
                                required
                            >
                                <option value="" disabled>Select Employee Type</option>
                                <option value="academic">Academic Employee</option>
                                <option value="administrative">Administrative Employee</option>
                        </select>

                        {employeeType === 'academic' && (
                            <>
                                <label>
                                    <select
                                        style={{ marginLeft: '1.5vw' }}
                                        className="regShad"
                                        value={college}
                                        onChange={(e) => setCollege(e.target.value)}
                                        required
                                    >
                                        <option value="" disabled>Select Academic College/Level</option>
                                        {Object.keys(academicColleges).map((collegeName) => (
                                            <option key={collegeName} value={collegeName}>
                                                {collegeName}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                {college && academicColleges[college].length > 0 && (
                                    <label>
                                        <select
                                            style={{ marginLeft: '1.5vw' }}
                                            className="regShad"
                                            value={department}
                                            onChange={(e) => setDepartment(e.target.value)}
                                            required
                                        >
                                            <option value="" disabled>Select Department</option>
                                            {academicColleges[college].map((dept, index) => (
                                                <option key={index} value={dept}>
                                                    {dept}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                )}
                            </>
                        )}

                        {employeeType === 'administrative' && (
                            <label>
                                <select
                                    style={{ marginLeft: '1.5vw' }}
                                    className="regShad"
                                    value={office}
                                    onChange={(e) => setOffice(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Select Administrative Office</option>
                                    {administrativeOffices.map((officeName, index) => (
                                        <option key={index} value={officeName}>
                                            {officeName}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        )}
                    </div>
                </div>

                <div className="register-button">
                        <button className="register-button" type="button" onClick={handleRegister}>
                            Register
                        </button>
                    </div>

                <div className="aregistered">
                        <p id="regQues">ALREADY REGISTERED? </p>
                    </div>
                    <a id="signIn" href="/"> Sign In</a>
            </form>
        </div>
    );
    
};

export default RegisterBody;