import React, { useState, useEffect } from 'react';
import { Users, Building2, UserCheck, Search, Plus, Pencil, Trash2, X, Menu, ChevronLeft, ChevronRight } from 'lucide-react';

const EmployeeDashboard = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [employees, setEmployees] = useState([
    {
      id: 'EMP001',
      name: 'Sarah Johnson',
      position: 'Senior Software Engineer',
      department: 'Engineering',
      email: 'sarah.johnson@company.com',
      status: 'Active'
    },
    {
      id: 'EMP002',
      name: 'Michael Chen',
      position: 'Product Manager',
      department: 'Product',
      email: 'michael.chen@company.com',
      status: 'Active'
    },
    {
      id: 'EMP003',
      name: 'Emily Rodriguez',
      position: 'UX Designer',
      department: 'Design',
      email: 'emily.rodriguez@company.com',
      status: 'Active'
    },
    {
      id: 'EMP004',
      name: 'David Kim',
      position: 'DevOps Engineer',
      department: 'Engineering',
      email: 'david.kim@company.com',
      status: 'Active'
    },
    {
      id: 'EMP005',
      name: 'Jessica Martinez',
      position: 'Marketing Manager',
      department: 'Marketing',
      email: 'jessica.martinez@company.com',
      status: 'Active'
    },
    {
      id: 'EMP006',
      name: 'James Anderson',
      position: 'Sales Director',
      department: 'Sales',
      email: 'james.anderson@company.com',
      status: 'Inactive'
    }
  ]);

  const [currentTablePage, setCurrentTablePage] = useState(1);
  const itemsPerPage = 5;

  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    contactNumber: '',
    email: '',
    birthday: '',
    age: '',
    sex: '',
    status: 'Active',
    position: '',
    department: '',
    region: '',
    province: '',
    city: '',
    barangay: '',
    street: '',
    zipCode: '',
    essentialFunctions: '',
    permanent: '',
    heardAboutPosition: '',
    workedBefore: '',
    workedWhen: '',
    regionCode: '',
    provinceCode: '',
    cityCode: '',
    canWorkOvertime: '',
    hasDriversLicense: '',
    licenseIssuingState: '',
    shifts: [],
    shiftOtherValue: '',
    shiftTypeLabel: '',
    employmentHistory: [
      { nameAddress1: '', nameAddress2: '', nameAddress3: '', pay: '', per: '', posSkills1: '', posSkills2: '', posSkills3: '', supervisor: '', contactNo: '', startDate: '', endDate: '', reasonLeaving1: '', reasonLeaving2: '', reasonLeaving3: '' },
      { nameAddress1: '', nameAddress2: '', nameAddress3: '', pay: '', per: '', posSkills1: '', posSkills2: '', posSkills3: '', supervisor: '', contactNo: '', startDate: '', endDate: '', reasonLeaving1: '', reasonLeaving2: '', reasonLeaving3: '' },
      { nameAddress1: '', nameAddress2: '', nameAddress3: '', pay: '', per: '', posSkills1: '', posSkills2: '', posSkills3: '', supervisor: '', contactNo: '', startDate: '', endDate: '', reasonLeaving1: '', reasonLeaving2: '', reasonLeaving3: '' }
    ],
    education: {
      elemSchool: '', elemYear: '',
      highSchool: '', highYear: '',
      collegeSchool: '', collegeYear: '',
      vocSchool: '', vocYear: ''
    },
    certificates: [
      { title: '', issuedBy: '', date: '' },
      { title: '', issuedBy: '', date: '' },
      { title: '', issuedBy: '', date: '' }
    ]
  });

  // Address Data States
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [zipCodeMap, setZipCodeMap] = useState({});

  const [selectedPosition, setSelectedPosition] = useState('');

  const [recentActivity] = useState([
    {
      type: 'new',
      title: 'New employee added',
      description: 'Christopher Lee joined Engineering department',
      time: '2 hours ago'
    },
    {
      type: 'update',
      title: 'Employee updated',
      description: "Sarah Johnson's position was updated",
      time: '5 hours ago'
    },
    {
      type: 'status',
      title: 'Status changed',
      description: 'James Anderson marked as inactive',
      time: '1 day ago'
    }
  ]);

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === 'Active').length;
  const departments = [...new Set(employees.map(emp => emp.department))].length;
  const uniquePositions = [...new Set(employees.map(emp => emp.position))];

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPosition = selectedPosition ? emp.position === selectedPosition : true;
    return matchesSearch && matchesPosition;
  });

  const indexOfLastItem = currentTablePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentTablePage(pageNumber);

  useEffect(() => {
    setCurrentTablePage(1);
  }, [searchQuery, selectedPosition]);

  useEffect(() => {
    if (formData.birthday) {
      const birthDate = new Date(formData.birthday);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData(prev => ({ ...prev, age: age.toString() }));
    } else {
      setFormData(prev => ({ ...prev, age: '' }));
    }
  }, [formData.birthday]);

  useEffect(() => {
    fetch('https://psgc.gitlab.io/api/regions/')
      .then(response => response.json())
      .then(data => setRegions(data.sort((a, b) => a.name.localeCompare(b.name))))
      .catch(err => console.error('Error fetching regions:', err));

    const fetchZipCodes = async () => {
      try {
        const [citiesRes, munisRes] = await Promise.all([
          fetch('https://psgc.cloud/api/cities'),
          fetch('https://psgc.cloud/api/municipalities')
        ]);

        const citiesData = await citiesRes.json();
        const munisData = await munisRes.json();

        const newMap = {};
        const processMsg = (list) => {
          list.forEach(item => {
            if (item.zip_code) {
              const cleanName = item.name.replace(/City of /i, '').replace(/Municipality of /i, '').trim().toLowerCase();
              newMap[cleanName] = item.zip_code;
              const normalized = cleanName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
              if (normalized !== cleanName) {
                newMap[normalized] = item.zip_code;
              }
            }
          });
        };

        processMsg(citiesData);
        processMsg(munisData);
        setZipCodeMap(newMap);
      } catch (error) {
        console.error('Error fetching zip codes from API:', error);
      }
    };

    fetchZipCodes();
  }, []);

  const handleRegionChange = (e) => {
    const regionCode = e.target.value;
    const regionName = e.target.options[e.target.selectedIndex].text;

    setFormData(prev => ({
      ...prev,
      region: regionName,
      regionCode: regionCode,
      province: '',
      provinceCode: '',
      city: '',
      cityCode: '',
      barangay: ''
    }));

    fetch(`https://psgc.gitlab.io/api/regions/${regionCode}/provinces/`)
      .then(response => response.json())
      .then(data => setProvinces(data.sort((a, b) => a.name.localeCompare(b.name))))
      .catch(err => console.error('Error fetching provinces:', err));
  };

  const handleProvinceChange = (e) => {
    const provinceCode = e.target.value;
    const provinceName = e.target.options[e.target.selectedIndex].text;

    setFormData(prev => ({
      ...prev,
      province: provinceName,
      provinceCode: provinceCode,
      city: '',
      cityCode: '',
      barangay: ''
    }));

    fetch(`https://psgc.gitlab.io/api/provinces/${provinceCode}/cities-municipalities/`)
      .then(response => response.json())
      .then(data => setCities(data.sort((a, b) => a.name.localeCompare(b.name))))
      .catch(err => console.error('Error fetching cities:', err));
  };

  const handleCityChange = (e) => {
    const cityCode = e.target.value;
    const cityName = e.target.options[e.target.selectedIndex].text;

    setFormData(prev => ({
      ...prev,
      city: cityName,
      cityCode: cityCode,
      barangay: ''
    }));

    fetch(`https://psgc.gitlab.io/api/cities-municipalities/${cityCode}/barangays/`)
      .then(response => response.json())
      .then(data => setBarangays(data.sort((a, b) => a.name.localeCompare(b.name))))
      .catch(err => console.error('Error fetching barangays:', err));
  };

  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      return;
    }

    const newEmployee = {
      id: `EMP${String(employees.length + 1).padStart(3, '0')}`,
      name: `${formData.firstName} ${formData.lastName}`,
      ...formData
    };
    setEmployees([...employees, newEmployee]);
    setShowModal(false);
    setCurrentStep(1);
    setFormData({
      firstName: '',
      middleName: '',
      lastName: '',
      contactNumber: '',
      email: '',
      birthday: '',
      age: '',
      sex: '',
      status: 'Active',
      position: '',
      department: '',
      region: '',
      province: '',
      city: '',
      barangay: '',
      street: '',
      zipCode: '',
      essentialFunctions: '',
      permanent: '',
      heardAboutPosition: '',
      workedBefore: '',
      workedWhen: '',
      regionCode: '',
      provinceCode: '',
      cityCode: '',
      canWorkOvertime: '',
      hasDriversLicense: '',
      licenseIssuingState: '',
      shifts: [],
      shiftOtherValue: '',
      shiftTypeLabel: '',
      employmentHistory: [
        { nameAddress1: '', nameAddress2: '', nameAddress3: '', pay: '', per: '', posSkills1: '', posSkills2: '', posSkills3: '', supervisor: '', contactNo: '', startDate: '', endDate: '', reasonLeaving1: '', reasonLeaving2: '', reasonLeaving3: '' },
        { nameAddress1: '', nameAddress2: '', nameAddress3: '', pay: '', per: '', posSkills1: '', posSkills2: '', posSkills3: '', supervisor: '', contactNo: '', startDate: '', endDate: '', reasonLeaving1: '', reasonLeaving2: '', reasonLeaving3: '' },
        { nameAddress1: '', nameAddress2: '', nameAddress3: '', pay: '', per: '', posSkills1: '', posSkills2: '', posSkills3: '', supervisor: '', contactNo: '', startDate: '', endDate: '', reasonLeaving1: '', reasonLeaving2: '', reasonLeaving3: '' }
      ],
      education: {
        elemSchool: '', elemYear: '',
        highSchool: '', highYear: '',
        collegeSchool: '', collegeYear: '',
        vocSchool: '', vocYear: ''
      },
      certificates: [
        { title: '', issuedBy: '', date: '' },
        { title: '', issuedBy: '', date: '' },
        { title: '', issuedBy: '', date: '' }
      ]
    });
  };

  const handleEmploymentChange = (index, col, value) => {
    setFormData(prev => {
      const newHistory = [...prev.employmentHistory];
      newHistory[index] = { ...newHistory[index], [col]: value };
      return { ...prev, employmentHistory: newHistory };
    });
  };

  const handleEducationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      education: {
        ...prev.education,
        [field]: value
      }
    }));
  };

  const handleCertificateChange = (index, field, value) => {
    setFormData(prev => {
      const newCertificates = [...prev.certificates];
      newCertificates[index] = { ...newCertificates[index], [field]: value };
      return { ...prev, certificates: newCertificates };
    });
  };

  const handleShiftChange = (shift) => {
    setFormData(prev => {
      const newShifts = prev.shifts.includes(shift)
        ? prev.shifts.filter(s => s !== shift)
        : [...prev.shifts, shift];
      return { ...prev, shifts: newShifts };
    });
  };

  const handleDeleteEmployee = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Mono:wght@400;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Calibre';
        }

        .stat-card {
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);
          animation: pulse 4s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, -20px); }
        }

        .card-enter {
          animation: cardEnter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes cardEnter {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .hover-lift {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .table-row {
          transition: all 0.2s ease;
        }

        .table-row:hover {
          background: linear-gradient(90deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
          transform: translateX(4px);
        }

        .btn-primary {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4);
        }

        .sidebar-item {
          position: relative;
          transition: all 0.3s ease;
        }

        .sidebar-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 0;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 0 4px 4px 0;
          transition: height 0.3s ease;
        }

        .sidebar-item.active::before {
          height: 70%;
        }

        .modal-backdrop {
          animation: fadeIn 0.3s ease;
        }

        .modal-content {
          animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(100px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .activity-item {
          animation: slideInLeft 0.5s ease;
          animation-fill-mode: both;
        }

        .activity-item:nth-child(1) { animation-delay: 0.1s; }
        .activity-item:nth-child(2) { animation-delay: 0.2s; }
        .activity-item:nth-child(3) { animation-delay: 0.3s; }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .badge {
          font-family: 'Space Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.5px;
        }

        .search-input {
          transition: all 0.3s ease;
        }

        .search-input:focus {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(99, 102, 241, 0.15);
        }
        
        .filter-select {
          transition: all 0.3s ease;
          appearance: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
        }

        .filter-select:focus {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(99, 102, 241, 0.15);
        }

        .icon-wrapper {
          transition: transform 0.3s ease;
        }

        .hover-lift:hover .icon-wrapper {
          transform: rotate(5deg) scale(1.1);
        }
      `}</style>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-2xl transition-all duration-300 ease-in-out flex flex-col sticky top-0 h-screen z-10`}>
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                  <img src="/logo.jpg" alt="EDP Logo" className="w-full h-full object-cover" />
                </div>
                {sidebarOpen && (
                  <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    EDP Engineering Services
                  </span>
                )}
              </div>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`sidebar-item w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentPage === 'dashboard'
                ? 'active bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600'
                : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
              <Building2 className={`w-5 h-5 ${sidebarOpen ? '' : 'mx-auto'}`} />
              {sidebarOpen && <span className="font-semibold">Dashboard</span>}
            </button>

            <button
              onClick={() => setCurrentPage('employees')}
              className={`sidebar-item w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentPage === 'employees'
                ? 'active bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600'
                : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
              <Users className={`w-5 h-5 ${sidebarOpen ? '' : 'mx-auto'}`} />
              {sidebarOpen && <span className="font-semibold">Employees</span>}
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="w-full p-4">
            {currentPage === 'dashboard' && (
              <div className="space-y-8">
                <div className="card-enter">
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-indigo-600 bg-clip-text text-transparent mb-2">
                    Dashboard
                  </h1>
                  <p className="text-slate-500 text-lg">Welcome back! Here's your overview</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="stat-card card-enter bg-white rounded-2xl p-8 shadow-xl hover-lift border border-slate-100" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-slate-500 font-semibold mb-2 uppercase tracking-wider text-sm">Total Employees</p>
                        <p className="text-5xl font-bold bg-gradient-to-br from-slate-800 to-indigo-600 bg-clip-text text-transparent">
                          {totalEmployees}
                        </p>
                      </div>
                      <div className="icon-wrapper w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Users className="w-7 h-7 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="stat-card card-enter bg-white rounded-2xl p-8 shadow-xl hover-lift border border-slate-100" style={{ animationDelay: '0.2s' }}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-slate-500 font-semibold mb-2 uppercase tracking-wider text-sm">Active Employees</p>
                        <p className="text-5xl font-bold bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                          {activeEmployees}
                        </p>
                      </div>
                      <div className="icon-wrapper w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <UserCheck className="w-7 h-7 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="stat-card card-enter bg-white rounded-2xl p-8 shadow-xl hover-lift border border-slate-100" style={{ animationDelay: '0.3s' }}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-slate-500 font-semibold mb-2 uppercase tracking-wider text-sm">Departments</p>
                        <p className="text-5xl font-bold bg-gradient-to-br from-orange-600 to-pink-600 bg-clip-text text-transparent">
                          {departments}
                        </p>
                      </div>
                      <div className="icon-wrapper w-14 h-14 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Building2 className="w-7 h-7 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-enter bg-white rounded-2xl p-8 shadow-xl border border-slate-100" style={{ animationDelay: '0.4s' }}>
                  <h2 className="text-2xl font-bold text-slate-800 mb-6">Recent Activity</h2>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="activity-item flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-all">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${activity.type === 'new' ? 'bg-emerald-100' :
                          activity.type === 'update' ? 'bg-blue-100' :
                            'bg-orange-100'
                          }`}>
                          {activity.type === 'new' && <UserCheck className="w-5 h-5 text-emerald-600" />}
                          {activity.type === 'update' && <Pencil className="w-5 h-5 text-blue-600" />}
                          {activity.type === 'status' && <Users className="w-5 h-5 text-orange-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800">{activity.title}</p>
                          <p className="text-slate-500 text-sm mt-1">{activity.description}</p>
                        </div>
                        <span className="text-slate-400 text-sm whitespace-nowrap">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentPage === 'employees' && (
              <div className="space-y-6">
                <div className="flex flex-col gap-6">
                  <div>
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-indigo-600 bg-clip-text text-transparent mb-2">
                      Employees
                    </h1>
                    <p className="text-slate-500 text-lg">Manage your team members</p>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto flex-1">
                      <div className="relative w-full md:w-56">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                          type="text"
                          placeholder="Search employees..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="search-input w-full pl-12 pr-4 py-3 bg-white rounded-xl border-2 border-slate-200 focus:border-indigo-400 focus:outline-none text-slate-700 placeholder-slate-400"
                        />
                      </div>
                      <div className="w-full md:w-56">
                        <select
                          value={selectedPosition}
                          onChange={(e) => setSelectedPosition(e.target.value)}
                          className="filter-select w-full px-4 py-3 bg-white rounded-xl border-2 border-slate-200 focus:border-indigo-400 focus:outline-none text-slate-700"
                        >
                          <option value="">All Positions</option>
                          {uniquePositions.map((position) => (
                            <option key={position} value={position}>
                              {position}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowModal(true)}
                      className="btn-primary flex items-center justify-center gap-2 px-6 py-3 text-white rounded-xl font-semibold shadow-lg whitespace-nowrap"
                    >
                      <Plus className="w-5 h-5" />
                      Add Employee
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 flex flex-col">
                  {/* Desktop Table */}
                  <div className="hidden lg:block overflow-x-auto flex-1">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-slate-50 to-indigo-50 border-b-2 border-indigo-100">
                          <th className="px-3 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Employee ID</th>
                          <th className="px-3 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Name</th>
                          <th className="px-3 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Position</th>
                          <th className="px-3 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Department</th>
                          <th className="px-3 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Email</th>
                          <th className="px-3 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                          <th className="px-3 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {currentItems.map((employee) => (
                          <tr key={employee.id} className="table-row">
                            <td className="px-3 py-4 whitespace-nowrap">
                              <span className="badge font-bold text-slate-700">{employee.id}</span>
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap">
                              <span className="font-semibold text-slate-800">{employee.name}</span>
                            </td>
                            <td className="px-3 py-4">
                              <span className="text-slate-600">{employee.position}</span>
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap">
                              <span className="text-slate-600">{employee.department}</span>
                            </td>
                            <td className="px-3 py-4 break-all">
                              <span className="text-slate-500">{employee.email}</span>
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap">
                              <span className={`badge px-3 py-1 rounded-full ${employee.status === 'Active'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-slate-100 text-slate-600'
                                }`}>
                                {employee.status}
                              </span>
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteEmployee(employee.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="lg:hidden divide-y divide-slate-100">
                    {currentItems.map((employee) => (
                      <div key={employee.id} className="p-6 hover:bg-slate-50 transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <span className="badge font-bold text-slate-600 block mb-1">{employee.id}</span>
                            <h3 className="font-bold text-lg text-slate-800">{employee.name}</h3>
                          </div>
                          <span className={`badge px-3 py-1 rounded-full ${employee.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                            }`}>
                            {employee.status}
                          </span>
                        </div>
                        <div className="space-y-2 mb-4">
                          <p className="text-slate-600"><span className="font-semibold">Position:</span> {employee.position}</p>
                          <p className="text-slate-600"><span className="font-semibold">Department:</span> {employee.department}</p>
                          <p className="text-slate-500 text-sm">{employee.email}</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="flex-1 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-100 transition-all flex items-center justify-center gap-2">
                            <Pencil className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(employee.id)}
                            className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <p className="text-sm text-slate-500 text-center md:text-left">
                    Showing <span className="font-bold">{indexOfFirstItem + 1}</span> to <span className="font-bold">{Math.min(indexOfLastItem, filteredEmployees.length)}</span> of <span className="font-bold">{filteredEmployees.length}</span> results
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setCurrentTablePage(prev => Math.max(prev - 1, 1))}
                      disabled={currentTablePage === 1}
                      className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => paginate(i + 1)}
                        className={`w-10 h-10 rounded-lg font-semibold transition-all ${currentTablePage === i + 1
                          ? 'bg-indigo-600 text-white shadow-lg'
                          : 'text-slate-600 hover:bg-slate-50'
                          }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentTablePage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentTablePage === totalPages}
                      className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>
                  <div className="hidden md:block"></div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add Employee Modal */}
      {showModal && (
        <div className="modal-backdrop fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="modal-content bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Add New Employee</h2>
                <p className="text-slate-500 text-sm mt-1">
                  Step {currentStep} of 3: {
                    currentStep === 1 ? 'Employee Information' :
                      currentStep === 2 ? 'Employment History' :
                        'Education & Certificates'
                  }
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="w-full h-2 bg-slate-100 rounded-full mb-8 overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-500 ease-in-out"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>

            <form onSubmit={handleAddEmployee} className="space-y-6">
              {currentStep === 1 ? (
                <div className="space-y-6 card-enter">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Middle Name</label>
                      <input
                        type="text"
                        value={formData.middleName}
                        onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none"
                        placeholder="D."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Contact Number</label>
                      <input
                        type="tel"
                        required
                        value={formData.contactNumber}
                        onChange={(e) => {
                          const numericValue = e.target.value.replace(/\D/g, '').slice(0, 11);
                          setFormData({ ...formData, contactNumber: numericValue });
                        }}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none"
                        placeholder="09123456789"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none"
                        placeholder="john.doe@company.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Birthday</label>
                      <input
                        type="date"
                        required
                        value={formData.birthday}
                        onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Age</label>
                      <input
                        type="number"
                        readOnly
                        value={formData.age}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 text-slate-500 focus:outline-none"
                        placeholder="Age"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Sex</label>
                      <select
                        value={formData.sex}
                        onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none"
                      >
                        <option value="">Select Sex</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Address Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Region</label>
                        <select
                          required
                          value={formData.regionCode}
                          onChange={handleRegionChange}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none"
                        >
                          <option value="">Select Region</option>
                          {regions.map(region => (
                            <option key={region.code} value={region.code}>{region.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Province</label>
                        <select
                          required
                          value={formData.provinceCode}
                          onChange={handleProvinceChange}
                          disabled={!formData.regionCode}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none disabled:bg-slate-50"
                        >
                          <option value="">Select Province</option>
                          {provinces.map(province => (
                            <option key={province.code} value={province.code}>{province.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">City/Municipality</label>
                        <select
                          required
                          value={formData.cityCode}
                          onChange={handleCityChange}
                          disabled={!formData.provinceCode}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none disabled:bg-slate-50"
                        >
                          <option value="">Select City/Municipality</option>
                          {cities.map(city => (
                            <option key={city.code} value={city.code}>{city.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Barangay</label>
                        <select
                          required
                          value={formData.barangay}
                          onChange={(e) => setFormData({ ...formData, barangay: e.target.value })}
                          disabled={!formData.cityCode}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none disabled:bg-slate-50"
                        >
                          <option value="">Select Barangay</option>
                          {barangays.map(barangay => (
                            <option key={barangay.code} value={barangay.name}>{barangay.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Street/Building Name</label>
                        <input
                          type="text"
                          value={formData.street}
                          onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none"
                          placeholder="Unit 123, Example Bldg., 123 Main St."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Zip Code</label>
                        <input
                          type="text"
                          value={formData.zipCode}
                          onChange={(e) => {
                            const numericValue = e.target.value.replace(/\D/g, '').slice(0, 4);
                            setFormData({ ...formData, zipCode: numericValue });
                          }}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 focus:border-indigo-400 focus:outline-none"
                          placeholder="Zip Code"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 mb-4">
                      <div className="flex flex-col items-start gap-2">
                        <label className="text-sm font-semibold text-slate-700">Can you perform the position's essential functions</label>
                        <div className="flex items-center space-x-6">
                          <span className="text-sm font-semibold text-slate-700">with or without accommodations?</span>
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={formData.essentialFunctions === 'Yes'}
                              onChange={() => setFormData({ ...formData, essentialFunctions: 'Yes' })}
                              className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-slate-700">Yes</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={formData.essentialFunctions === 'No'}
                              onChange={() => setFormData({ ...formData, essentialFunctions: 'No' })}
                              className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-slate-700">No</span>
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <label className="text-sm font-semibold text-slate-700">I am seeking a permanent position:</label>
                        <div className="flex items-center space-x-6">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={formData.permanent === 'Yes'}
                              onChange={() => setFormData({ ...formData, permanent: 'Yes' })}
                              className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-slate-700">Yes</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={formData.permanent === 'No'}
                              onChange={() => setFormData({ ...formData, permanent: 'No' })}
                              className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-slate-700">No</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">How did you hear about the position?</label>
                      <input
                        type="text"
                        value={formData.heardAboutPosition}
                        onChange={(e) => setFormData({ ...formData, heardAboutPosition: e.target.value })}
                        className="w-1/2 px-2 pt-2 pb-4 border-b-4 border-slate-300 focus:border-indigo-600 focus:outline-none bg-transparent"
                        placeholder="Min. of 200 characters"
                      />
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                      <div className="w-full md:w-1/2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Have you ever worked for this company?</label>
                        <input
                          type="text"
                          value={formData.workedBefore}
                          onChange={(e) => setFormData({ ...formData, workedBefore: e.target.value })}
                          className="w-full px-2 pt-2 pb-4 border-b-4 border-slate-300 focus:border-indigo-600 focus:outline-none bg-transparent"
                          placeholder="Yes/No"
                        />
                      </div>
                      <div className="w-full md:w-1/2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">If yes, when?</label>
                        <input
                          type="text"
                          value={formData.workedWhen}
                          onChange={(e) => setFormData({ ...formData, workedWhen: e.target.value })}
                          className="w-full px-2 pt-2 pb-4 border-b-4 border-slate-300 focus:border-indigo-600 focus:outline-none bg-transparent"
                          placeholder="Year/Date"
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-4">
                        <p className="text-sm font-bold text-slate-800 tracking-wide">If necessary for the job, I can:</p>

                        <div className="flex items-center space-x-6">
                          <label className="text-sm font-semibold text-slate-700">Work overtime?</label>
                          <div className="flex items-center space-x-6">
                            <label className="flex items-center space-x-2 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={formData.canWorkOvertime === 'Yes'}
                                onChange={() => setFormData({ ...formData, canWorkOvertime: 'Yes' })}
                                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all group-hover:border-indigo-400"
                              />
                              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Yes</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={formData.canWorkOvertime === 'No'}
                                onChange={() => setFormData({ ...formData, canWorkOvertime: 'No' })}
                                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all group-hover:border-indigo-400"
                              />
                              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">No</span>
                            </label>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6">
                          <label className="text-sm font-semibold text-slate-700">Do you have a Driver's License?</label>
                          <div className="flex items-center space-x-6">
                            <label className="flex items-center space-x-2 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={formData.hasDriversLicense === 'Yes'}
                                onChange={() => setFormData({ ...formData, hasDriversLicense: 'Yes' })}
                                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all group-hover:border-indigo-400"
                              />
                              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Yes</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={formData.hasDriversLicense === 'No'}
                                onChange={() => setFormData({ ...formData, hasDriversLicense: 'No' })}
                                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all group-hover:border-indigo-400"
                              />
                              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">No</span>
                            </label>
                          </div>
                        </div>

                        <div className={`space-y-4 transition-all duration-300 ${formData.hasDriversLicense === 'Yes' ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden pointer-events-none'}`}>
                          <p className="text-sm font-semibold text-slate-700">If so, fill out the following:</p>
                          <div className="flex items-end gap-4 ml-4">
                            <label className="text-sm font-semibold text-slate-700 mb-4 whitespace-nowrap">Issuing state:</label>
                            <input
                              type="text"
                              value={formData.licenseIssuingState}
                              onChange={(e) => setFormData({ ...formData, licenseIssuingState: e.target.value })}
                              className="w-48 px-2 pt-2 pb-4 border-b-4 border-slate-300 focus:border-indigo-600 focus:outline-none bg-transparent"
                              placeholder="State Name"
                              disabled={formData.hasDriversLicense !== 'Yes'}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-slate-100">
                        <p className="text-sm font-bold text-slate-800 tracking-wide">s: (check all that apply)</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {['Any', 'Day', 'Night', 'Swing', 'Rotating', 'Split', 'Graveyard'].map((shift) => (
                            <label key={shift} className="flex items-center space-x-2 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={formData.shifts.includes(shift)}
                                onChange={() => handleShiftChange(shift)}
                                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all group-hover:border-indigo-400"
                              />
                              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{shift}</span>
                            </label>
                          ))}
                          <div className="flex items-center space-x-2 group">
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.shifts.includes('Other')}
                                onChange={() => handleShiftChange('Other')}
                                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all group-hover:border-indigo-400"
                              />
                              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Other:</span>
                            </label>
                            <input
                              type="text"
                              value={formData.shiftOtherValue}
                              onChange={(e) => setFormData({ ...formData, shiftOtherValue: e.target.value })}
                              className="w-full px-2 py-1 border-b-2 border-slate-300 focus:border-indigo-600 focus:outline-none bg-transparent text-sm"
                              placeholder="Specify..."
                              disabled={!formData.shifts.includes('Other')}
                            />
                          </div>
                        </div>
                        <div className="flex items-end gap-2 max-w-md">
                          <label className="text-sm font-semibold text-slate-700 whitespace-nowrap mb-1">Type: </label>
                          <input
                            type="text"
                            value={formData.shiftTypeLabel}
                            onChange={(e) => setFormData({ ...formData, shiftTypeLabel: e.target.value })}
                            className="flex-1 px-2 py-1 border-b-2 border-slate-300 focus:border-indigo-600 focus:outline-none bg-transparent text-sm"
                            placeholder="Shift details"
                          />
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              ) : currentStep === 2 ? (
                <div className="space-y-6 card-enter">
                  <p className="text-sm text-slate-500 italic">List most recent employment first.</p>

                  <div className="overflow-hidden border-2 border-slate-200 rounded-xl">
                    <table className="w-full border-collapse">
                      <tbody>
                        {[0, 1, 2].map((rowIndex) => (
                          <tr key={rowIndex} className={rowIndex !== 2 ? "border-b-2 border-slate-200" : ""}>
                            <td className="border-r-2 border-slate-200 p-4 align-top">
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-xs font-semibold text-slate-700 mb-1">Employee name and address: </label>
                                  <div className="space-y-2">
                                    <input
                                      type="text"
                                      value={formData.employmentHistory[rowIndex].nameAddress1}
                                      onChange={(e) => handleEmploymentChange(rowIndex, 'nameAddress1', e.target.value)}
                                      className="w-full border-b border-slate-300 focus:border-indigo-600 focus:outline-none bg-transparent text-sm pb-1"
                                      placeholder="..."
                                    />
                                    <input
                                      type="text"
                                      value={formData.employmentHistory[rowIndex].nameAddress2}
                                      onChange={(e) => handleEmploymentChange(rowIndex, 'nameAddress2', e.target.value)}
                                      className="w-full border-b border-slate-300 focus:border-indigo-600 focus:outline-none bg-transparent text-sm pb-1"
                                      placeholder="..."
                                    />
                                    <input
                                      type="text"
                                      value={formData.employmentHistory[rowIndex].nameAddress3}
                                      onChange={(e) => handleEmploymentChange(rowIndex, 'nameAddress3', e.target.value)}
                                      className="w-full border-b border-slate-300 focus:border-indigo-600 focus:outline-none bg-transparent text-sm pb-1"
                                      placeholder="..."
                                    />
                                  </div>
                                </div>
                                <div className="flex items-end gap-2">
                                  <label className="text-xs font-semibold text-slate-700 whitespace-nowrap mb-1">Pay: ₱</label>
                                  <input
                                    type="text"
                                    value={formData.employmentHistory[rowIndex].pay}
                                    onChange={(e) => {
                                      const rawValue = e.target.value.replace(/\D/g, '');
                                      const formattedValue = rawValue ? new Intl.NumberFormat().format(rawValue) : '';
                                      handleEmploymentChange(rowIndex, 'pay', formattedValue);
                                    }}
                                    className="flex-1 border-b border-slate-300 focus:border-indigo-600 focus:outline-none bg-transparent text-sm pb-1"
                                    placeholder="..."
                                  />
                                </div>
                                <div className="flex items-end gap-2">
                                  <label className="text-xs font-semibold text-slate-700 whitespace-nowrap mb-1">Per: </label>
                                  <input
                                    type="text"
                                    value={formData.employmentHistory[rowIndex].per}
                                    onChange={(e) => {
                                      const rawValue = e.target.value.replace(/\D/g, '');
                                      const formattedValue = rawValue ? new Intl.NumberFormat().format(rawValue) : '';
                                      handleEmploymentChange(rowIndex, 'per', formattedValue);
                                    }}
                                    className="flex-1 border-b border-slate-300 focus:border-indigo-600 focus:outline-none bg-transparent text-sm pb-1"
                                    placeholder="..."
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="border-r-2 border-slate-200 p-4 align-top">
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-xs font-semibold text-slate-700 mb-1">Position title/duties, skills: </label>
                                  <div className="space-y-2">
                                    <input
                                      type="text"
                                      value={formData.employmentHistory[rowIndex].posSkills1}
                                      onChange={(e) => handleEmploymentChange(rowIndex, 'posSkills1', e.target.value)}
                                      className="w-full border-b border-slate-300 focus:border-indigo-600 focus:outline-none bg-transparent text-sm pb-1"
                                      placeholder="..."
                                    />
                                    <input
                                      type="text"
                                      value={formData.employmentHistory[rowIndex].posSkills2}
                                      onChange={(e) => handleEmploymentChange(rowIndex, 'posSkills2', e.target.value)}
                                      className="w-full border-b border-slate-300 focus:border-indigo-600 focus:outline-none bg-transparent text-sm pb-1"
                                      placeholder="..."
                                    />
                                    <input
                                      type="text"
                                      value={formData.employmentHistory[rowIndex].posSkills3}
                                      onChange={(e) => handleEmploymentChange(rowIndex, 'posSkills3', e.target.value)}
                                      className="w-full border-b border-slate-300 focus:border-indigo-600 focus:outline-none bg-transparent text-sm pb-1"
                                      placeholder="..."
                                    />
                                  </div>
                                </div>
                                <div className="flex items-end gap-2">
                                  <label className="text-xs font-semibold text-slate-700 whitespace-nowrap mb-1">Supervisor: </label>
                                  <input
                                    type="text"
                                    value={formData.employmentHistory[rowIndex].supervisor}
                                    onChange={(e) => handleEmploymentChange(rowIndex, 'supervisor', e.target.value)}
                                    className="flex-1 border-b border-slate-300 focus:border-indigo-600 focus:outline-none bg-transparent text-sm pb-1"
                                    placeholder="..."
                                  />
                                </div>
                                <div className="flex items-end gap-2">
                                  <label className="text-xs font-semibold text-slate-700 whitespace-nowrap mb-1">Contact no.: </label>
                                  <input
                                    type="text"
                                    value={formData.employmentHistory[rowIndex].contactNo}
                                    onChange={(e) => {
                                      const numericValue = e.target.value.replace(/\D/g, '').slice(0, 11);
                                      handleEmploymentChange(rowIndex, 'contactNo', numericValue);
                                    }}
                                    className="flex-1 border-b border-slate-300 focus:border-indigo-600 focus:outline-none bg-transparent text-sm pb-1"
                                    placeholder="..."
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="p-4 align-top">
                              <div className="space-y-3">
                                <div className="flex items-end gap-2">
                                  <label className="text-xs font-semibold text-slate-700 whitespace-nowrap mb-1">Start date: </label>
                                  <input
                                    type="date"
                                    value={formData.employmentHistory[rowIndex].startDate}
                                    onChange={(e) => handleEmploymentChange(rowIndex, 'startDate', e.target.value)}
                                    className="flex-1 border-b border-slate-300 focus:border-indigo-600 focus:outline-none bg-transparent text-sm pb-1 uppercase"
                                  />
                                </div>
                                <div className="flex items-end gap-2">
                                  <label className="text-xs font-semibold text-slate-700 whitespace-nowrap mb-1">End date: </label>
                                  <input
                                    type="date"
                                    value={formData.employmentHistory[rowIndex].endDate}
                                    onChange={(e) => handleEmploymentChange(rowIndex, 'endDate', e.target.value)}
                                    className="flex-1 border-b border-slate-300 focus:border-indigo-600 focus:outline-none bg-transparent text-sm pb-1 uppercase"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="block text-xs font-semibold text-slate-700">Reason for leaving: </label>
                                  <div className="space-y-2">
                                    <input
                                      type="text"
                                      value={formData.employmentHistory[rowIndex].reasonLeaving1}
                                      onChange={(e) => handleEmploymentChange(rowIndex, 'reasonLeaving1', e.target.value)}
                                      className="w-full border-b border-slate-300 focus:border-indigo-600 focus:outline-none bg-transparent text-sm pb-1"
                                      placeholder="..."
                                    />
                                    <input
                                      type="text"
                                      value={formData.employmentHistory[rowIndex].reasonLeaving2}
                                      onChange={(e) => handleEmploymentChange(rowIndex, 'reasonLeaving2', e.target.value)}
                                      className="w-full border-b border-slate-300 focus:border-indigo-600 focus:outline-none bg-transparent text-sm pb-1"
                                      placeholder="..."
                                    />
                                    <input
                                      type="text"
                                      value={formData.employmentHistory[rowIndex].reasonLeaving3}
                                      onChange={(e) => handleEmploymentChange(rowIndex, 'reasonLeaving3', e.target.value)}
                                      className="w-full border-b border-slate-300 focus:border-indigo-600 focus:outline-none bg-transparent text-sm pb-1"
                                      placeholder="..."
                                    />
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="space-y-8 card-enter">
                  <div className="bg-white p-6 rounded-2xl border-2 border-slate-200">
                    <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm italic">I</span>
                      EDUCATION
                    </h3>

                    <div className="space-y-6">
                      {[
                        { id: 'elem', label: 'ELEMENTARY' },
                        { id: 'high', label: 'HIGH SCHOOL' },
                        { id: 'college', label: 'COLLEGE' },
                        { id: 'voc', label: 'VOCATIONAL' }
                      ].map((level) => (
                        <div key={level.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                          <div className="md:col-span-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{level.label}</label>
                          </div>
                          <div className="md:col-span-7">
                            <input
                              type="text"
                              value={formData.education[`${level.id}School`]}
                              onChange={(e) => handleEducationChange(`${level.id}School`, e.target.value)}
                              className="w-full border-b-2 border-slate-200 focus:border-indigo-600 focus:outline-none bg-transparent text-sm pb-1"
                              placeholder="School Name"
                            />
                          </div>
                          <div className="md:col-span-3">
                            <input
                              type="text"
                              value={formData.education[`${level.id}Year`]}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                                handleEducationChange(`${level.id}Year`, val);
                              }}
                              className="w-full border-b-2 border-slate-200 focus:border-indigo-600 focus:outline-none bg-transparent text-sm pb-1"
                              placeholder="Year Graduated"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border-2 border-slate-200">
                    <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm italic">II</span>
                      CERTIFICATES / VOCATIONAL COURSE
                    </h3>

                    <div className="overflow-hidden border border-slate-200 rounded-xl">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200">Title of Course</th>
                            <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200">Issued by</th>
                            <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[0, 1, 2].map((idx) => (
                            <tr key={idx} className={idx !== 2 ? "border-b border-slate-200" : ""}>
                              <td className="p-2 border-r border-slate-200">
                                <input
                                  type="text"
                                  value={formData.certificates[idx].title}
                                  onChange={(e) => handleCertificateChange(idx, 'title', e.target.value)}
                                  className="w-full bg-transparent focus:outline-none text-sm px-2"
                                  placeholder="..."
                                />
                              </td>
                              <td className="p-2 border-r border-slate-200">
                                <input
                                  type="text"
                                  value={formData.certificates[idx].issuedBy}
                                  onChange={(e) => handleCertificateChange(idx, 'issuedBy', e.target.value)}
                                  className="w-full bg-transparent focus:outline-none text-sm px-2"
                                  placeholder="..."
                                />
                              </td>
                              <td className="p-2">
                                <input
                                  type="date"
                                  value={formData.certificates[idx].date}
                                  onChange={(e) => handleCertificateChange(idx, 'date', e.target.value)}
                                  className="w-full bg-transparent focus:outline-none text-sm px-2 uppercase"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <div className="flex-1 flex justify-end gap-3">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all"
                    >
                      Previous
                    </button>
                  )}
                  <button
                    type="submit"
                    className="btn-primary px-8 py-3 text-white rounded-xl font-semibold shadow-lg"
                  >
                    {currentStep === 3 ? 'Save Employee' : 'Next Step'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
