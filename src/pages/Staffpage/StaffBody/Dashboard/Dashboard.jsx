import { useEffect, useState } from 'react';
import './Dashboard.css';
import { FaFileAlt, FaUser, FaCheckCircle } from 'react-icons/fa';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell
} from 'recharts';
import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';

const Dashboard = () => {
  const [values, setValues] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  });

  const [rejected,setRejected] = useState('hide');
  const [disabled,setDisabled] = useState(false);
  const [completeDisable, setCompleteDisable] = useState(false);
  const [commentDisabled, setCommentDisabled] = useState('hide');

  const [show, setShow] = useState('hide');
  const [commentShow, setCommentShow] = useState('hide');
  const [buttonShow, setButtonShow] = useState('hide');
  const [statusClass, setStatusClass] = useState('reqStatRejected');

  // Details
  const [selectedComment, setSelectedComment] = useState(null);
  const [requestID, setRequestID] = useState();
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [desc, setDesc] = useState('');
  const [fileName, setFileName] = useState('');
  const [giveExam, setGiveExam] = useState(false);
  const [noOfCopies, setNoOfCopies] = useState(0);
  const [colored, setColored] = useState(false);
  const [useDate, setUseDate] = useState('');
  const [requestDate, setRequestDate] = useState('');
  const [title, setTitle] = useState('');
  const [paperSize, setPaperSize] = useState('');
  const [colorType, setColorType] = useState('');
  const [paperType, setPaperType] = useState('');
  const [fileType, setFileType] = useState('');
  const [status, setStatus] = useState('');
  const [userID, setUserID] = useState('');
  const [schoolId, setSchoolId]= useState('');
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState([]);
  const [requesterName, setRequesterName] = useState('');
  const [requesterEmail, setRequesterEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [alert, setAlert] = useState('hide');
  const [alertMsg, setAlertMsg] = useState('');
  const [success, setSuccess] = useState(false);
  // Comment Details
  const [commentHeader, setCommentHeader] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [commentDate, setCommentDate] = useState('');
  const [editable, setEditable] = useState(true);

  const [downloadURL, setDownloadURL] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(''); // State to track selected status

  const [statistics, setStatistics] = useState({
    totalEmployees: 0,
    totalStaff: 0,
    pendingRequests: 0,
    inProgressRequests: 0,
    completedRequests: 0,
    rejectedRequests: 0,
    claimedRequests: 0,
  });

  useEffect(() => {
    fetch("http://localhost:8080/records/requestCounts")
      .then((response) => response.json())
      .then((data) => {
        setStatistics((prevState) => ({
          ...prevState,
          pendingRequests: data.pendingRequests || 0,
          inProgressRequests: data.inProgressRequests || 0,
          completedRequests: data.completedRequests || 0,
          rejectedRequests: data.rejectedRequests || 0,
          claimedRequests: data.claimedRequests || 0,
        }));
      })
      .catch((error) => console.error("Error fetching request counts:", error));
  }, []);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    fetch("http://localhost:8080/requests/all", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setValues(data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const renderHeader = () => {
    return (
      <div id="historyHeader" className="flex">
        <h1 style={{color: '#fff'}}>{selectedStatus || 'All Requests'}</h1> {/* Show selected status or default */}
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
        </IconField>
      </div>
    );
  };
  const header = renderHeader();



  const handleBoxClick = (status) => {
    setSelectedStatus(status);
  
    const requestOptions = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    };
  
    // Fetch all records from the backend
    fetch(`http://localhost:8080/requests/all`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const statusMap = {
          'Waiting for Approval': 'Pending',
          'Approved for Printing': 'In Progress',
          'Ready to Claim': 'Completed',
          'Claimed': 'Claimed',
          'Rejected': 'Rejected',
        };
        
        const updatedData = data
          .map(item => ({
            ...item,
            status: statusMap[item.status] || item.status,
          }))
          .filter(item => item.status === statusMap[status]);
  
        setValues(updatedData);
      })
      .catch((error) => {
        console.log('Error fetching data based on status:', error);
      });
  };


const closeComment = () => {
    setCommentShow('hide');
    setButtonShow('hide');
}

const closeModal = () => {
    setShow('hide');
}

const getCustomSeverityClass = (status) => {
  switch (status) {
      case 'Ready to Claim':
          return 'custom-completed';
      case 'Approved for Printing':
          return 'custom-progress'; 
      case 'Waiting for Approval':
          return 'custom-pending';
      case 'Claimed':
          return 'custom-claimed';
      case 'Rejected':
          return 'custom-rejected';
      default:
          return 'custom-default'; 
  }
};

const renderSeverityTag = (rowData) => {
  if (rowData.status === 'Rejected') {
    rowData.status = 'Rejected';
  } else if (rowData.status === 'Pending') {
      rowData.status = 'Waiting for Approval';
  } else if (rowData.status === 'In Progress') {
      rowData.status = 'Approved for Printing';
  } else if (rowData.status === 'Completed') {
      rowData.status = 'Ready to Claim';
  } else if (rowData.status=== 'Claimed') {
      rowData.status = 'Ready to Claim';
  } 

  const severityClass = getCustomSeverityClass(rowData.status);
  return <span className={severityClass}>{rowData.status}</span>;
};


  return (
    <div>
      <div className="dashboard-container">
        <div className="box-container">
          {/* Request status boxes */}
          <div className="box" onClick={() => handleBoxClick('Approved for Printing')}>
            <div className="content-box">
              <FaCheckCircle style={{ color: '#1672d4' }} className="icon" />
              <p className="box-text">Approved for Printing</p>
            </div>
            <div className="extra-box">
              <p className="count">
                {statistics.inProgressRequests}
              </p>
            </div>
          </div>

          <div className="box" onClick={() => handleBoxClick('Waiting for Approval')}>
            <div className="content-box">
              <FaCheckCircle style={{ color: 'rgb(240, 158, 34)' }} className="icon" />
              <p className="box-text">Waiting for Approval</p>
            </div>
            <div className="extra-box">
              <p className="count">
                {statistics.pendingRequests}
              </p>
            </div>
          </div>

          <div className="box" onClick={() => handleBoxClick('Ready to Claim')}>
            <div className="content-box">
              <FaCheckCircle style={{ color: 'yellow' }} className="icon" />
              <p className="box-text">Ready to Claim</p>
            </div>
            <div className="extra-box">
              <p className="count">{statistics.completedRequests}</p>
            </div>
          </div>

          <div className="box" onClick={() => handleBoxClick('Claimed')}>
            <div className="content-box">
              <FaCheckCircle style={{ color: '#155724' }} className="icon" />
              <p className="box-text">Claimed</p>
            </div>
            <div className="extra-box">
              <p className="count">{statistics.claimedRequests}</p>
            </div>
          </div>

          <div className="box" onClick={() => handleBoxClick('Rejected')}>
            <div className="content-box">
              <FaCheckCircle style={{ color: '#681016' }} className="icon" />
              <p className="box-text">Rejected Requests</p>
            </div>
            <div className="extra-box">
              <p className="count">{statistics.rejectedRequests}</p>
            </div>
          </div>
        </div>

        <div id="dashboardTable">
              <DataTable 
                value={values} 
                scrollable 
                scrollHeight="20vw" 
                header={header} 
                globalFilterFields={['requesterName', 'college', 'department', 'requestID', 'description', 'colored', 'fileType', 'fileName', 'paperSize', 'paperType', 'requestDate', 'requestTime', 'role']}
                filters={filters} 
                emptyMessage="No records found."
                paginator 
                rows={8}
                tableStyle={{ minWidth: '20vw' }} 
                selectionMode="single"
                >
                    <Column field="requesterName" header="Requester's Name" sortable headerStyle={{ width: '150px', whiteSpace: 'nowrap' }}></Column>
                    
                    {/* Custom rendering logic for the College column */}
                    <Column 
                        field="college" 
                        header="College" 
                        sortable 
                        headerStyle={{ width: '150px', whiteSpace: 'nowrap' }}
                        body={(rowData) => (
                            rowData.college === "Elementary" || 
                            rowData.college === "Junior High School" || 
                            rowData.college === "Senior High School" ||
                            rowData.college === "University Library" ||
                            rowData.college === "Vice President for Academic Affairs" 
                                ? "" // Show empty if it's one of the specified levels
                                : rowData.college // Show actual college value otherwise
                        )}
                    ></Column>
                    
                    <Column field="department" header="Department" sortable headerStyle={{ width: '150px', whiteSpace: 'nowrap' }}></Column>
                    <Column field="requestID" header="Request ID" sortable headerStyle={{ width: '150px', whiteSpace: 'nowrap' }}></Column>
                    <Column field="fileType" header="File Type" sortable headerStyle={{ width: '150px', whiteSpace: 'nowrap' }}></Column>
                    <Column field="fileName" header="File Name" sortable headerStyle={{ width: '150px', whiteSpace: 'nowrap' }}></Column>
                    <Column field="description" header="Description" sortable headerStyle={{ width: '150px', whiteSpace: 'nowrap' }}></Column>
                    <Column field="noOfCopies" header="No. of Copies" sortable headerStyle={{ width: '150px', whiteSpace: 'nowrap' }}></Column>
                    <Column field="colored" header="Colored" sortable headerStyle={{ width: '150px', whiteSpace: 'nowrap' }}></Column>
                    <Column field="paperSize" header="Paper Size" sortable headerStyle={{ width: '150px', whiteSpace: 'nowrap' }}></Column>
                    <Column field="paperType" header="Paper Type" sortable headerStyle={{ width: '150px', whiteSpace: 'nowrap' }}></Column>
                    <Column field="requestDate" header="Request Date" sortable headerStyle={{ width: '150px', whiteSpace: 'nowrap' }}></Column>
                    <Column field="requestTime" header="Request Time" sortable headerStyle={{ width: '150px', whiteSpace: 'nowrap' }}></Column>
                    <Column field="useDate" header="Use Date" sortable headerStyle={{ width: '150px', whiteSpace: 'nowrap' }}></Column>
                    <Column field="role" header="Role" sortable headerStyle={{ width: '150px', whiteSpace: 'nowrap' }}></Column>
                    <Column field="status" header="Status" body={renderSeverityTag} headerStyle={{ width: '150px', paddingRight: '150px', whiteSpace: 'nowrap' }}></Column>
                </DataTable>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
