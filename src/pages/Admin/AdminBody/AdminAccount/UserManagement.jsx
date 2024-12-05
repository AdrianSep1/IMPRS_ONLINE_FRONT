import './AdminAccount.css';
import React, { useEffect, useState } from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { FaLock, FaUser } from 'react-icons/fa';
import { HiIdentification } from "react-icons/hi2";
import { HiAtSymbol } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
  const [values, setValues] = useState([]);
  const [alert, setAlert] = useState('hide');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [adminVerified, setAdminVerified] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [confirmPass, setConfirmPass] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [role, setRole] = useState('staff');
  const navigate = useNavigate();
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [editedFirstName, setEditedFirstName] = useState('');
  const [editedLastName, setEditedLastName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedSchoolId, setEditedSchoolId] = useState('');
  const [userId, setUserId] = useState('');
  const [editedPassword, setEditedPassword] = useState('');

  const renderHeader = () => {
    return (
      <div id="userHeader" className="flex">
        <h1 style={{color: '#fff'}}>Employee Management</h1>
      </div>
    );
  };
  
  const renderStaffHeader = () => {
    return (
      <div id="userHeader" className="flex">
        <h1 style={{color: '#fff'}}>Staff Management</h1>
      </div>
    );
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
  };

  const header = renderHeader();
  const staffHeader = renderStaffHeader();
  const handleLogOut = () => {
    localStorage.setItem('firstName', '');
    localStorage.setItem('lastName', '');
    localStorage.setItem('email', '');
    localStorage.setItem('userID', '');
    localStorage.setItem('isLoggedIn', '');
    navigate('/');
  };

  const showInfoPop = (message, isSuccess = false) => {
    setAlert('show');
    setAlertMsg(message);
    setSuccess(isSuccess);
  };

  const fetchData = () => {
    fetch('http://localhost:8080/services/all')
        .then((response) => response.json())
        .then((data) => {
            const filteredUsers = data.filter(user => user.role === 'staff' || user.role === 'Administrative' || user.role === 'Academic');
            setValues(filteredUsers);
        })
        .catch((error) => {
            console.error('Error fetching staff list:', error);
            showInfoPop('Failed to fetch data. Please try again later.');
        });
};

  const closeInfoPop = () => {
    setAlert('hide');
    if (success) {
      window.location.reload();
    } else {
      setTimeout(() => {
        fetchData();
      }, 1000);
    }
  };
    
  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    fetch('http://localhost:8080/services/all', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        // Filter users based on role
        const filteredUsers = data.filter(
          (user) => user.role === 'Academic' || user.role === 'staff' || user.role === 'Administrative'
        );
        setValues(filteredUsers);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleAccept = (userEmail) => {
    console.log(userEmail);
    const requestOptions = {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: userEmail }),
    };

    fetch('http://localhost:8080/services/updateAdminVerified', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          console.log('User accepted:', userEmail);
          setValues((prevValues) => prevValues.filter(user => user.email !== userEmail));
          showInfoPop(`User registration accepted!`, true);
        } else {
          console.error('Error accepting user:', data.message);
          showInfoPop(`Error accepting user: ${data.message}`);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        showInfoPop('An error occurred while accepting the user.');
      });
  };

  const handleDecline = (userEmail) => {
    console.log(userEmail);
    const requestOptions = {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: userEmail }),
    };

    fetch('http://localhost:8080/services/declineUser', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          console.log('User declined:', userEmail);
          setValues((prevValues) => prevValues.filter(user => user.email !== userEmail));
          showInfoPop(`User registration declined!`, true);
        } else {
          console.error('Error declining user:', data.message);
          showInfoPop(`Error declining user: ${data.message}`);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        showInfoPop('An error occurred while declining the user.');
      });
  };

  const closeDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
    setUserToDelete(null); 
  };

  const handleDelete = (userEmail) => {
    setUserToDelete(userEmail); // Set the user to delete
    setIsDeleteConfirmOpen(true); // Open confirmation modal
  };
  const handleConfirmDelete = () => {
    if (userToDelete) {
      confirmDelete(userToDelete); 
    }
  };
  const confirmDelete = (userEmail) => {
    console.log(userEmail);
    const requestOptions = {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: userEmail }),
    };
  
    fetch('http://localhost:8080/services/deleteUser', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          console.log('User deleted:', userEmail);
          setValues((prevValues) => prevValues.filter(user => user.email !== userEmail));
          showInfoPop(`User deleted successfully!`, true);
        } else {
          console.error('Error declining user:', data.message);
          showInfoPop(`Error declining user: ${data.message}`);
        }
        closeDeleteConfirm(); 
      })
      .catch((error) => {
        console.error('Error:', error);
        showInfoPop('An error occurred while deleting the user.');
        closeDeleteConfirm(); 
      });
  };

  const roleBodyTemplate = (rowData) => {
    if (rowData.role === 'Academic' || rowData.role === 'Administrative') {
      if (rowData.adminVerified) {
        return (
          <button onClick={() => handleDelete(rowData.email)} className='delete-button'>
            Delete
          </button>
        );
      } else {
        return (
          <div>
            <button onClick={() => handleAccept(rowData.email)} className='accept-button'>
              Accept
            </button>
            <button onClick={() => handleDecline(rowData.email)} className='decline-button'>
              Decline
            </button>
          </div>
        );
      }
    }
    else if (rowData.role === 'staff'){
      return (
        <div>
          <button onClick={() => handleEditStaff(rowData)} className='accept-button'>
            Edit
          </button>
          <button onClick={() => handleDelete(rowData.email)} className='delete-button'>
            Delete
          </button>
        </div>
      );
    }
    return null; // Return null if the row is not an employee
  };

  const closeButton = ()=>{
    setIsModalOpen(false);
    setIsEditModalOpen(false);
  }

  const handleAddStaff = ()=>{
    setIsModalOpen(true);
  }

  const addStaff = async () => {
    if (!firstName || !lastName || !email || !password || !schoolId) {
        showInfoPop('All fields are required.');
        return;
    }
    if (!email.match(/^[a-zA-Z0-9._%+-]+@cit\.edu$/)) {
        showInfoPop('Please use a valid cit.edu email address to register.');
        return;
    }

    try {
        const emailExistsResponse = await fetch(`http://localhost:8080/services/exists?email=${email}`);
        const emailExists = await emailExistsResponse.json();
        if (emailExists) {
            showInfoPop('That email is already in use! Please use another email.');
            return;
        }

        const schoolIdExistsResponse = await fetch(`http://localhost:8080/services/exists?schoolId=${schoolId}`);
        const schoolIdExists = await schoolIdExistsResponse.json();
        if (schoolIdExists) {
            showInfoPop('That School ID is already in use! Please use another School ID.');
            return;
        }

        const response = await fetch(
            `http://localhost:8080/services/NewStaffRegistration?firstName=${firstName}&lastName=${lastName}&password=${password}&email=${email}&schoolId=${schoolId}&role=${role}`,
            { method: 'POST', headers: { 'Content-Type': 'application/json' } }
        );
        if (response.ok) {
            showInfoPop('Successfully Added Staff', true);
            closeModal();
            fetchData(); // Refresh data after successful addition
        } else {
            throw new Error('Failed to add staff.');
        }
    } catch (error) {
        console.error('Error adding staff:', error);
        showInfoPop('An error occurred during registration. Please try again.');
    }
};



  const handleEditStaff = (user) => {
    setUserToEdit(user);
    setUserId(user.id);
    setEditedPassword(user.password);
    setEditedFirstName(user.firstName);
    setEditedLastName(user.lastName);
    setEditedEmail(user.email);
    setEditedSchoolId(user.schoolId);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {

    const requestOptions = {
      method: 'PUT',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: userId,
        email: editedEmail,
        firstName: editedFirstName,
        lastName: editedLastName,
        schoolId: editedSchoolId,
        password: editedPassword,
      }),
    };
  
    fetch(`http://localhost:8080/services/updateStaff?id=${userId}&firstName=${firstName}&lastName=${lastName}&password=${password}&email=${email}&schoolId=${schoolId}&role=${role}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          // Update the staff list
          setValues((prevValues) =>
            prevValues.map((user) =>
              user.email === editedEmail
                ? { ...user, firstName: editedFirstName, lastName: editedLastName, schoolId: editedSchoolId, password: editedPassword }
                : user
            )
          );
          showInfoPop('Staff updated successfully!', true);
          closeModal();
        } else {
          showInfoPop(`Error updating staff: ${data.message}`);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        showInfoPop('An error occurred while updating the staff.');
      });
  };
  

  return (
    <div id='userPage'>
        <div id="infoPopOverlay" className={alert}></div>
        <div id="infoPop" className={alert}>
        <p>{alertMsg}</p>
        <button id="infoChangeBtn" onClick={closeInfoPop}>Close</button>
        </div>
        <div id="usersTable">
          <DataTable
                value={values.filter(user => user.role === 'Administrative' || user.role === 'Academic')} 
                scrollable
                scrollHeight="15vw"
                header={header}
                emptyMessage="No data found."
                className="custom-data-table"
                selectionMode="single"
            >
                <Column field="schoolId" header="School ID"></Column>
                <Column field="firstName" header="First Name"></Column>
                <Column field="lastName" header="Last Name"></Column>
                <Column field="email" header="Email"></Column>
                <Column field="role" header="Role"></Column>
                <Column field="Action" header="Action" body={roleBodyTemplate}></Column>
            </DataTable>
        </div>
        
        <button id='addStaff' onClick={() => handleAddStaff()}>Add Staff +</button>

        {isModalOpen && (
          <div className="modal-backdrop" onClick={closeModal}>
            <div className="staff-container" onClick={(e) => e.stopPropagation()}>
            <div id="infoPopOverlay" className={alert}></div>
              <div id="infoPop" className={alert}>
                  <p>{alertMsg}</p>
                  <button id="infoChangeBtn" onClick={closeInfoPop}>Close</button>
              </div>
              <form>
                <h2 style={{ marginBottom: "4vw" }}>Add Staff</h2>
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
                  </div>
                  <div className="column">
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

                  </div>
                </div>

                <div className="register-button">
                  <button className="register-button" type="button" onClick={addStaff}>
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}


    {isEditModalOpen && (
          <div className="modal-backdrop" onClick={closeModal}>
            <div className="staff-container" onClick={(e) => e.stopPropagation()}>
            <div id="infoPopOverlay" className={alert}></div>
              <div id="infoPop" className={alert}>
                  <p>{alertMsg}</p>
                  <button id="infoChangeBtn" onClick={closeInfoPop}>Close</button>
              </div>
              <form>
                <h2 style={{ marginBottom: "4vw" }}>Edit Staff</h2>
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
                  </div>
                  <div className="column">
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
                      <HiIdentification />
                      <input
                        className="regShad"
                        type="text"
                        value={schoolId}
                        onChange={(e) => setSchoolId(e.target.value)}
                        placeholder="School ID"
                      />
                    </label>
                  </div>
                </div>

                <div className="register-button">
                  <button className="register-button" type="button" onClick={handleSaveEdit}>
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete confirmation modal */}
        {isDeleteConfirmOpen && (
          <div className="modal-backdrop" onClick={closeDeleteConfirm}>
            <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Are you sure you want to delete this user?</h3>
              <button onClick={handleConfirmDelete}>Yes, Delete</button>
              <button onClick={closeDeleteConfirm} className='cancel-button'>Cancel</button>
            </div>
          </div>
        )}

        <div id="usersTable" style={{marginTop: '-2vw'}}>
            <DataTable
                value={values.filter(user => user.role === 'staff')} 
                scrollable
                scrollHeight="15vw"
                header={staffHeader}
                emptyMessage="No data found."
                className="custom-data-table"
                selectionMode="single"
            >
                <Column field="schoolId" header="School ID"></Column>
                <Column field="firstName" header="First Name"></Column>
                <Column field="lastName" header="Last Name"></Column>
                <Column field="email" header="Email"></Column>
                <Column field="role" header="Role"></Column>
                <Column field="Action" header="Action" body={roleBodyTemplate}></Column>
            </DataTable>
        </div>

    </div>
);

};

export default UserManagement;