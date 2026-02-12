import React, { useState, useEffect } from 'react';
import { Users, Building2, UserCheck, Search, Plus, Pencil, Trash2, X, Menu, ChevronLeft, ChevronRight, Eye, Maximize2, Minimize2 } from 'lucide-react';
import { supabase } from './supabaseClient';

const SignaturePad = ({ value, onChange, disabled = false }) => {
  const canvasRef = React.useRef(null);
  const [isDrawing, setIsDrawing] = React.useState(false);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Handle resizing
    const resizeCanvas = () => {
      const currentData = canvas.toDataURL();
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = currentData;

      ctx.strokeStyle = '#312e81';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    if (value) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = value;
    }

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [value]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    if (disabled) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    e.preventDefault();
  };

  const endDrawing = () => {
    if (!isDrawing || disabled) return;
    setIsDrawing(false);
    onChange(canvasRef.current.toDataURL());
  };

  const clear = () => {
    if (disabled) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onChange('');
  };

  return (
    <div className="relative bg-slate-50 border-2 border-slate-200 rounded-xl p-2">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseOut={endDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={endDrawing}
        className={`w-full h-60 touch-none ${disabled ? 'cursor-not-allowed' : 'cursor-crosshair'}`}
      />
      {!disabled && (
        <button
          type="button"
          onClick={clear}
          className="absolute top-2 right-2 px-2 py-1 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 text-[10px] uppercase font-bold rounded border border-slate-200 transition-colors"
        >
          Clear Signature
        </button>
      )}
    </div>
  );
};

const INITIAL_FORM_DATA = {
  employeeIdNumber: '',
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
  education: [
    { level: 'High School', institution: '', years: '', field: '', degree: '' },
    { level: 'College/University', institution: '', years: '', field: '', degree: '' },
    { level: 'Business/Technical', institution: '', years: '', field: '', degree: '' },
    { level: 'Additional', institution: '', years: '', field: '', degree: '' }
  ],
  hasNCII: '',
  specializedTraining: '',
  otherQualifications: '',
  computerEquipment: '',
  professionalLicenses: '',
  additionalSkills: '',
  references: [
    { lastName: '', firstName: '', middleName: '', address: '', telephone: '', occupation: '', yearsKnown: '' },
    { lastName: '', firstName: '', middleName: '', address: '', telephone: '', occupation: '', yearsKnown: '' }
  ],
  emergencyContact: {
    name: '',
    relationship: '',
    address: '',
    contactNumber: ''
  },
  applicantSignature: '',
  dateSigned: '',
  positionApplied: '',
  applicationDate: '',

  // Hiring & Interview Info
  interviewedBy: '',
  interviewDate: '',
  remarks1: '',
  remarks2: '',
  neatness: '',
  ability: '',
  hired: '',
  hiredPosition: '',
  hiredDept: '',
  salaryWage: '',
  reportingDate: '',

  // Requirements & Government IDs
  sssNo: '',
  hasBirthCertificate: false,
  philhealthNo: '',
  hasMarriageContract: false,
  pagibigNo: '',
  hasNciiCertificate: false,
  tinNo: '',
  hasNbi: false,
  nbiExpiryDate: '',
  hasEmploymentContract: false,
  employmentContractExpiryDate: '',
  hasDrugTest: false,
  drugTestExpiryDate: '',
  hasHealthCard: false,
  healthCardExpiryDate: '',
  healthCardStatus: '',
  hasBarangayClearance: false,
  barangayClearanceExpiryDate: '',
  hasQuitclaim: false,

  // Uniform & PPE
  hasLongPants: false,
  longPantsQty: '',
  hasPvcId: false,
  hasSling: false,
  hasLongSleeves: false,
  longSleevesBrownQty: '',
  longSleevesWhiteQty: '',
  longSleevesOthers: '',
  uniformRemarks: '',
  ppeSafetyShoes: false,
  ppeGripGloves: false,
  ppeCottonGloves: false,
  ppeHardhat: false,
  ppeFaceshield: false,
  ppeKn95Mask: false,
  ppeSpectacles: false,
  ppeEarplug: false,
  ppeWeldingMask: false,
  ppeWeldingGloves: false,
  ppeWeldingApron: false,
  ppeFullBodyHarness: false,

  // Approvals
  approvedHrManager: '',
  approvedGeneralManager: '',
  approvedAsstManager: ''
};

const EmployeeDashboard = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [employees, setEmployees] = useState([]);

  const [currentTablePage, setCurrentTablePage] = useState(1);
  const itemsPerPage = 5;

  const [currentStep, setCurrentStep] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState(null);

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [originalEmployeeData, setOriginalEmployeeData] = useState(null);

  // Address Data States
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [zipCodeMap, setZipCodeMap] = useState({});

  const [selectedPosition, setSelectedPosition] = useState('');
  const [showAllColumns, setShowAllColumns] = useState(false);

  // Delete Confirmation States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === 'Active').length;
  const departments = [...new Set(employees.map(emp => emp.hired_dept || emp.department))].length;
  const uniquePositions = [...new Set(employees.map(emp => emp.hired_position || emp.position))].filter(Boolean);

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.employee_id || '').toLowerCase().includes(searchQuery.toLowerCase());
    const empPosition = emp.hired_position || emp.position;
    const matchesPosition = selectedPosition ? empPosition === selectedPosition : true;
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

  // Fetch employees and activity logs from Supabase on mount
  useEffect(() => {
    fetchEmployees();
    fetchActivityLogs();

    // Subscribe to new activity logs
    const activitySubscription = supabase
      .channel('activity_logs_realtime')
      .on('postgres_changes', { event: 'INSERT', table: 'activity_logs' }, (payload) => {
        setRecentActivity(prev => [payload.new, ...prev].slice(0, 5));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(activitySubscription);
    };
  }, []);

  const fetchActivityLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      if (data) setRecentActivity(data);
    } catch (error) {
      console.error('Error fetching activity logs:', error.message);
    }
  };

  const logActivity = async (type, title, description) => {
    try {
      await supabase
        .from('activity_logs')
        .insert([{ type, title, description }]);
    } catch (error) {
      console.error('Error logging activity:', error.message);
    }
  };

  const detectSignificantChanges = (oldData, newData) => {
    const changes = [];

    if (oldData.hired_position !== newData.hired_position) {
      changes.push(`Position: ${oldData.hired_position || 'None'} → ${newData.hired_position || 'None'}`);
    }
    if (oldData.hired_dept !== newData.hired_dept) {
      changes.push(`Department: ${oldData.hired_dept || 'None'} → ${newData.hired_dept || 'None'}`);
    }
    if (oldData.status !== newData.status) {
      changes.push(`Status: ${oldData.status || 'None'} → ${newData.status || 'None'}`);
    }
    if (oldData.contact_number !== newData.contact_number) {
      changes.push(`Contact: ${oldData.contact_number || 'None'} → ${newData.contact_number || 'None'}`);
    }
    if (oldData.salary_wage !== newData.salary_wage) {
      changes.push(`Salary updated`);
    }

    return changes;
  };

  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const fetchEmployees = async () => {
    // Check if Supabase is configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project-url') || supabaseKey.includes('your-anon-key')) {
      console.log('Supabase not configured. Using local mode.');
      return; // Use local state instead
    }

    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('last_name', { ascending: true })
        .order('first_name', { ascending: true });

      if (error) throw error;

      if (data) {
        const formattedEmployees = data.map(emp => {
          // Extract the 4-digit number from employee_id (e.g., "EDP NO.1001" -> "1001")
          const employeeIdNumber = emp.employee_id ? emp.employee_id.replace('EDP NO.', '').replace('EDP.', '') : '';

          // Format name: Last Name, First Name, Middle Name
          const middleNamePart = emp.middle_name ? `, ${emp.middle_name}` : '';
          const name = `${emp.last_name}, ${emp.first_name}${middleNamePart}`;

          return {
            ...emp,
            name,
            employeeIdNumber
          };
        });
        setEmployees(formattedEmployees);
      }
    } catch (error) {
      console.error('Error fetching employees:', error.message);
    }
  };

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

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
      return;
    }

    // Check if Supabase is configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const useLocalMode = !supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project-url') || supabaseKey.includes('your-anon-key');

    if (useLocalMode) {
      // Local mode - use state only
      if (isEditing) {
        setEmployees(employees.map(emp =>
          emp.id === editEmployeeId
            ? { ...emp, ...formData, name: `${formData.firstName} ${formData.lastName}` }
            : emp
        ));
      } else {
        const newEmployee = {
          id: `EMP${String(employees.length + 1).padStart(3, '0')}`,
          name: `${formData.firstName} ${formData.lastName}`,
          ...formData
        };
        setEmployees([...employees, newEmployee]);
      }

      setShowModal(false);
      setCurrentStep(1);
      setIsEditing(false);
      setIsViewOnly(false);
      setEditEmployeeId(null);
      setFormData(INITIAL_FORM_DATA);
      return;
    }

    try {
      // Prepare main employee data
      const employeeData = {
        employee_id: formData.employeeIdNumber ? `EDP NO.${formData.employeeIdNumber}` : null,
        first_name: formData.firstName || '',
        middle_name: formData.middleName || '',
        last_name: formData.lastName || '',
        contact_number: formData.contactNumber || '',
        email: formData.email || '',
        birthday: formData.birthday || null,
        age: formData.age ? parseInt(formData.age) : null,
        sex: formData.sex || '',
        status: formData.status || 'Active',
        position: formData.position || '',
        department: formData.department || '',
        region: formData.region || '',
        province: formData.province || '',
        city: formData.city || '',
        barangay: formData.barangay || '',
        street: formData.street || '',
        zip_code: formData.zipCode || '',
        region_code: formData.regionCode || '',
        province_code: formData.provinceCode || '',
        city_code: formData.cityCode || '',
        position_applied: formData.positionApplied || '',
        application_date: formData.applicationDate || null,
        essential_functions: formData.essentialFunctions || '',
        permanent: formData.permanent === 'Yes',
        heard_about_position: formData.heardAboutPosition || '',
        worked_before: formData.workedBefore || '',
        worked_when: formData.workedWhen || null,
        can_work_overtime: formData.canWorkOvertime === 'Yes',
        has_drivers_license: formData.hasDriversLicense === 'Yes',
        license_issuing_state: formData.licenseIssuingState || '',
        shifts: formData.shifts || [],
        shift_other_value: formData.shiftOtherValue || '',
        shift_type_label: formData.shiftTypeLabel || '',
        has_ncii: formData.hasNCII === 'Yes',
        specialized_training: formData.specializedTraining || '',
        other_qualifications: formData.otherQualifications || '',
        computer_equipment: formData.computerEquipment || '',
        professional_licenses: formData.professionalLicenses || '',
        additional_skills: formData.additionalSkills || '',
        emergency_contact_name: formData.emergencyContact?.name || '',
        emergency_contact_relationship: formData.emergencyContact?.relationship || '',
        emergency_contact_address: formData.emergencyContact?.address || '',
        emergency_contact_number: formData.emergencyContact?.contactNumber || '',
        applicant_signature: formData.applicantSignature || '',
        date_signed: formData.dateSigned || null,
        interviewed_by: formData.interviewedBy || '',
        interview_date: formData.interviewDate || null,
        remarks1: formData.remarks1 || '',
        remarks2: formData.remarks2 || '',
        neatness: formData.neatness || '',
        ability: formData.ability || '',
        hired: formData.hired || '',
        hired_position: formData.hiredPosition || '',
        hired_dept: formData.hiredDept || '',
        salary_wage: formData.salaryWage || '',
        reporting_date: formData.reportingDate || null,
        sss_no: formData.sssNo || '',
        has_birth_certificate: formData.hasBirthCertificate || false,
        philhealth_no: formData.philhealthNo || '',
        has_marriage_contract: formData.hasMarriageContract || false,
        pagibig_no: formData.pagibigNo || '',
        has_ncii_certificate: formData.hasNciiCertificate || false,
        tin_no: formData.tinNo || '',
        has_nbi: formData.hasNbi || false,
        nbi_expiry_date: formData.nbiExpiryDate || null,
        has_employment_contract: formData.hasEmploymentContract || false,
        employment_contract_expiry_date: formData.employmentContractExpiryDate || null,
        has_drug_test: formData.hasDrugTest || false,
        drug_test_expiry_date: formData.drugTestExpiryDate || null,
        has_health_card: formData.hasHealthCard || false,
        health_card_expiry_date: formData.healthCardExpiryDate || null,
        health_card_status: formData.healthCardStatus || '',
        has_barangay_clearance: formData.hasBarangayClearance || false,
        barangay_clearance_expiry_date: formData.barangayClearanceExpiryDate || null,
        has_quitclaim: formData.hasQuitclaim || false,
        has_long_pants: formData.hasLongPants || false,
        long_pants_qty: formData.longPantsQty || '',
        has_pvc_id: formData.hasPvcId || false,
        has_sling: formData.hasSling || false,
        has_long_sleeves: formData.hasLongSleeves || false,
        long_sleeves_brown_qty: formData.longSleevesBrownQty || '',
        long_sleeves_white_qty: formData.longSleevesWhiteQty || '',
        long_sleeves_others: formData.longSleevesOthers || '',
        uniform_remarks: formData.uniformRemarks || '',
        ppe_safety_shoes: formData.ppeSafetyShoes || false,
        ppe_grip_gloves: formData.ppeGripGloves || false,
        ppe_cotton_gloves: formData.ppeCottonGloves || false,
        ppe_hardhat: formData.ppeHardhat || false,
        ppe_faceshield: formData.ppeFaceshield || false,
        ppe_kn95_mask: formData.ppeKn95Mask || false,
        ppe_spectacles: formData.ppeSpectacles || false,
        ppe_earplug: formData.ppeEarplug || false,
        ppe_welding_mask: formData.ppeWeldingMask || false,
        ppe_welding_gloves: formData.ppeWeldingGloves || false,
        ppe_welding_apron: formData.ppeWeldingApron || false,
        ppe_full_body_harness: formData.ppeFullBodyHarness || false,
        approved_hr_manager: formData.approvedHrManager || '',
        approved_general_manager: formData.approvedGeneralManager || '',
        approved_asst_manager: formData.approvedAsstManager || ''
      };

      let employeeId;

      if (isEditing && editEmployeeId) {
        // Update existing employee
        const { error } = await supabase
          .from('employees')
          .update(employeeData)
          .eq('id', editEmployeeId);

        if (error) throw error;
        employeeId = editEmployeeId;

        // Log updated employee with detailed changes
        const changes = originalEmployeeData ? detectSignificantChanges(originalEmployeeData, employeeData) : [];
        const changeDescription = changes.length > 0
          ? `${formData.lastName}, ${formData.firstName}: ${changes.join(', ')}`
          : `${formData.lastName}, ${formData.firstName}'s information was updated`;

        await logActivity('update', 'Employee information updated', changeDescription);
        setOriginalEmployeeData(null);

        // Delete existing related records
        await supabase.from('employment_history').delete().eq('employee_id', employeeId);
        await supabase.from('education').delete().eq('employee_id', employeeId);
        await supabase.from('professional_references').delete().eq('employee_id', employeeId);
      } else {
        // Insert new employee
        const { data, error } = await supabase
          .from('employees')
          .insert([employeeData])
          .select()
          .single();

        if (error) throw error;
        employeeId = data.id;

        // Log new employee
        await logActivity('new', 'New employee added', `${formData.lastName}, ${formData.firstName} joined ${formData.hiredDept || formData.department || 'the team'}`);
      }

      // Insert employment history - only non-empty rows
      if (formData.employmentHistory && formData.employmentHistory.length > 0) {
        const historyRecords = formData.employmentHistory
          .filter(emp => emp.nameAddress1 || emp.nameAddress2 || emp.nameAddress3 || emp.posSkills1)
          .map((emp, index) => ({
            employee_id: employeeId,
            name_address1: emp.nameAddress1 || '',
            name_address2: emp.nameAddress2 || '',
            name_address3: emp.nameAddress3 || '',
            pay: emp.pay || '',
            per: emp.per || '',
            pos_skills1: emp.posSkills1 || '',
            pos_skills2: emp.posSkills2 || '',
            pos_skills3: emp.posSkills3 || '',
            supervisor: emp.supervisor || '',
            contact_no: emp.contactNo || '',
            start_date: emp.startDate || null,
            end_date: emp.endDate || null,
            reason_leaving1: emp.reasonLeaving1 || '',
            reason_leaving2: emp.reasonLeaving2 || '',
            reason_leaving3: emp.reasonLeaving3 || '',
            display_order: index
          }));

        if (historyRecords.length > 0) {
          const { error: histError } = await supabase.from('employment_history').insert(historyRecords);
          if (histError) console.error('Error inserting employment history:', histError);
        }
      }

      // Insert education - only non-empty rows
      if (formData.education && formData.education.length > 0) {
        const educationRecords = formData.education
          .filter(edu => edu.institution || edu.degree)
          .map(edu => ({
            employee_id: employeeId,
            level: edu.level,
            institution: edu.institution || '',
            years: edu.years || '',
            field: edu.field || '',
            degree: edu.degree || ''
          }));

        if (educationRecords.length > 0) {
          const { error: eduError } = await supabase.from('education').insert(educationRecords);
          if (eduError) console.error('Error inserting education:', eduError);
        }
      }

      // Insert references - only non-empty rows
      if (formData.references && formData.references.length > 0) {
        const referenceRecords = formData.references
          .filter(ref => ref.firstName || ref.lastName || ref.telephone)
          .map(ref => ({
            employee_id: employeeId,
            last_name: ref.lastName || '',
            first_name: ref.firstName || '',
            middle_name: ref.middleName || '',
            address: ref.address || '',
            telephone: ref.telephone || '',
            occupation: ref.occupation || '',
            years_known: ref.yearsKnown || ''
          }));

        if (referenceRecords.length > 0) {
          const { error: refError } = await supabase.from('professional_references').insert(referenceRecords);
          if (refError) console.error('Error inserting professional references:', refError);
        }
      }

      // Refresh employee list
      await fetchEmployees();

      setShowModal(false);
      setCurrentStep(1);
      setIsEditing(false);
      setIsViewOnly(false);
      setEditEmployeeId(null);
      setFormData(INITIAL_FORM_DATA);
    } catch (error) {
      console.error('Detailed Error saving employee:', error);
      alert(`Failed to save employee: ${error.message || 'Unknown error'}. Please check your Supabase connection and schema.`);
    }
  };

  const handleOpenAddModal = () => {
    setFormData(INITIAL_FORM_DATA);
    setIsEditing(false);
    setIsViewOnly(false);
    setEditEmployeeId(null);
    setCurrentStep(1);
    setShowModal(true);
  };

  const loadEmployeeData = async (employee) => {
    // Check if Supabase is configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const useLocalMode = !supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project-url') || supabaseKey.includes('your-anon-key');

    // Extract names
    const firstName = employee.first_name || (employee.name || '').split(' ')[0] || '';
    const lastName = employee.last_name || (employee.name || '').split(' ').slice(1).join(' ') || '';

    let baseData = {
      ...INITIAL_FORM_DATA,
      ...employee,
      employeeIdNumber: employee.employee_id ? employee.employee_id.replace('EDP NO.', '').replace('EDP.', '') : '',
      firstName: firstName,
      lastName: lastName,
      middleName: employee.middle_name || '',
      contactNumber: employee.contact_number || '',
      zipCode: employee.zip_code || '',
      regionCode: employee.region_code || '',
      provinceCode: employee.province_code || '',
      cityCode: employee.city_code || '',
      positionApplied: employee.position_applied || '',
      applicationDate: employee.application_date || '',
      essentialFunctions: employee.essential_functions || '',
      permanent: employee.permanent ? 'Yes' : 'No',
      heardAboutPosition: employee.heard_about_position || '',
      workedBefore: employee.worked_before || '',
      workedWhen: employee.worked_when || '',
      canWorkOvertime: employee.can_work_overtime ? 'Yes' : 'No',
      hasDriversLicense: employee.has_drivers_license ? 'Yes' : 'No',
      licenseIssuingState: employee.license_issuing_state || '',
      shiftOtherValue: employee.shift_other_value || '',
      shiftTypeLabel: employee.shift_type_label || '',
      hasNCII: employee.has_ncii ? 'Yes' : 'No',
      specializedTraining: employee.specialized_training || '',
      otherQualifications: employee.other_qualifications || '',
      computerEquipment: employee.computer_equipment || '',
      professionalLicenses: employee.professional_licenses || '',
      additionalSkills: employee.additional_skills || '',
      emergencyContact: {
        name: employee.emergency_contact_name || '',
        relationship: employee.emergency_contact_relationship || '',
        address: employee.emergency_contact_address || '',
        contactNumber: employee.emergency_contact_number || ''
      },
      applicantSignature: employee.applicant_signature || '',
      dateSigned: employee.date_signed || '',

      // Hiring & Interview Info
      interviewedBy: employee.interviewed_by || '',
      interviewDate: employee.interview_date || '',
      remarks1: employee.remarks1 || '',
      remarks2: employee.remarks2 || '',
      neatness: employee.neatness || '',
      ability: employee.ability || '',
      hired: employee.hired || '',
      hiredPosition: employee.hired_position || '',
      hiredDept: employee.hired_dept || '',
      salaryWage: employee.salary_wage || '',
      reportingDate: employee.reporting_date || '',

      // Requirements & Government IDs
      sssNo: employee.sss_no || '',
      hasBirthCertificate: employee.has_birth_certificate || false,
      philhealthNo: employee.philhealth_no || '',
      hasMarriageContract: employee.has_marriage_contract || false,
      pagibigNo: employee.pagibig_no || '',
      hasNciiCertificate: employee.has_ncii_certificate || false,
      tinNo: employee.tin_no || '',
      hasNbi: employee.has_nbi || false,
      nbiExpiryDate: employee.nbi_expiry_date || '',
      hasEmploymentContract: employee.has_employment_contract || false,
      employmentContractExpiryDate: employee.employment_contract_expiry_date || '',
      hasDrugTest: employee.has_drug_test || false,
      drugTestExpiryDate: employee.drug_test_expiry_date || '',
      hasHealthCard: employee.has_health_card || false,
      healthCardExpiryDate: employee.health_card_expiry_date || '',
      healthCardStatus: employee.health_card_status || '',
      hasBarangayClearance: employee.has_barangay_clearance || false,
      barangayClearanceExpiryDate: employee.barangay_clearance_expiry_date || '',
      hasQuitclaim: employee.has_quitclaim || false,

      // Uniform & PPE
      hasLongPants: employee.has_long_pants || false,
      longPantsQty: employee.long_pants_qty || '',
      hasPvcId: employee.has_pvc_id || false,
      hasSling: employee.has_sling || false,
      hasLongSleeves: employee.has_long_sleeves || false,
      longSleevesBrownQty: employee.long_sleeves_brown_qty || '',
      longSleevesWhiteQty: employee.long_sleeves_white_qty || '',
      longSleevesOthers: employee.long_sleeves_others || '',
      uniformRemarks: employee.uniform_remarks || '',
      ppeSafetyShoes: employee.ppe_safety_shoes || false,
      ppeGripGloves: employee.ppe_grip_gloves || false,
      ppeCottonGloves: employee.ppe_cotton_gloves || false,
      ppeHardhat: employee.ppe_hardhat || false,
      ppeFaceshield: employee.ppe_faceshield || false,
      ppeKn95Mask: employee.ppe_kn95_mask || false,
      ppeSpectacles: employee.ppe_spectacles || false,
      ppeEarplug: employee.ppe_earplug || false,
      ppeWeldingMask: employee.ppe_welding_mask || false,
      ppeWeldingGloves: employee.ppe_welding_gloves || false,
      ppeWeldingApron: employee.ppe_welding_apron || false,
      ppeFullBodyHarness: employee.ppe_full_body_harness || false,

      // Approvals
      approvedHrManager: employee.approved_hr_manager || '',
      approvedGeneralManager: employee.approved_general_manager || '',
      approvedAsstManager: employee.approved_asst_manager || ''
    };

    if (useLocalMode) {
      setFormData(baseData);
      return;
    }

    try {
      // Fetch related data in parallel
      const [historyRes, educationRes, referencesRes] = await Promise.all([
        supabase.from('employment_history').select('*').eq('employee_id', employee.id).order('display_order', { ascending: true }),
        supabase.from('education').select('*').eq('employee_id', employee.id),
        supabase.from('professional_references').select('*').eq('employee_id', employee.id)
      ]);

      if (historyRes.data) {
        baseData.employmentHistory = historyRes.data.map(h => ({
          nameAddress1: h.name_address1 || '',
          nameAddress2: h.name_address2 || '',
          nameAddress3: h.name_address3 || '',
          pay: h.pay || '',
          per: h.per || '',
          posSkills1: h.pos_skills1 || '',
          posSkills2: h.pos_skills2 || '',
          posSkills3: h.pos_skills3 || '',
          supervisor: h.supervisor || '',
          contactNo: h.contact_no || '',
          startDate: h.start_date || '',
          endDate: h.end_date || '',
          reasonLeaving1: h.reason_leaving1 || '',
          reasonLeaving2: h.reason_leaving2 || '',
          reasonLeaving3: h.reason_leaving3 || ''
        }));
        // Ensure at least 3 rows
        while (baseData.employmentHistory.length < 3) {
          baseData.employmentHistory.push({ nameAddress1: '', nameAddress2: '', nameAddress3: '', pay: '', per: '', posSkills1: '', posSkills2: '', posSkills3: '', supervisor: '', contactNo: '', startDate: '', endDate: '', reasonLeaving1: '', reasonLeaving2: '', reasonLeaving3: '' });
        }
      }

      if (educationRes.data) {
        // Map degrees/levels to our standard 4 levels if possible, or just use what's there
        const mappedEdu = educationRes.data.map(e => ({
          level: e.level,
          institution: e.institution || '',
          years: e.years || '',
          field: e.field || '',
          degree: e.degree || ''
        }));

        // Match levels to INITIAL_FORM_DATA levels
        const standardEdu = INITIAL_FORM_DATA.education.map(std => {
          const found = mappedEdu.find(m => m.level === std.level);
          return found || std;
        });
        baseData.education = standardEdu;
      }

      if (referencesRes.data) {
        baseData.references = referencesRes.data.map(r => ({
          lastName: r.last_name || '',
          firstName: r.first_name || '',
          middleName: r.middle_name || '',
          address: r.address || '',
          telephone: r.telephone || '',
          occupation: r.occupation || '',
          yearsKnown: r.years_known || ''
        }));
        // Ensure at least 2 rows
        while (baseData.references.length < 2) {
          baseData.references.push({ lastName: '', firstName: '', middleName: '', address: '', telephone: '', occupation: '', yearsKnown: '' });
        }
      }

      setFormData(baseData);
    } catch (error) {
      console.error('Error loading related employee data:', error.message);
      setFormData(baseData); // Still set base data even if related fetch fails
    }
  };

  const handleEditEmployee = async (employee) => {
    setIsEditing(true);
    setIsViewOnly(false);
    setEditEmployeeId(employee.id);
    setOriginalEmployeeData(employee);
    setCurrentStep(1);
    setShowModal(true);
    await loadEmployeeData(employee);
  };

  const handleViewEmployee = async (employee) => {
    setIsEditing(false);
    setIsViewOnly(true);
    setEditEmployeeId(employee.id);
    setCurrentStep(1);
    setShowModal(true);
    await loadEmployeeData(employee);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setIsViewOnly(false);
    setEditEmployeeId(null);
    setFormData(INITIAL_FORM_DATA);
    setCurrentStep(1);
  };

  const handleEmploymentChange = (index, col, value) => {
    setFormData(prev => {
      const newHistory = [...prev.employmentHistory];
      newHistory[index] = { ...newHistory[index], [col]: value };
      return { ...prev, employmentHistory: newHistory };
    });
  };

  const handleEducationChange = (index, field, value) => {
    setFormData(prev => {
      const newEducation = [...prev.education];
      newEducation[index] = { ...newEducation[index], [field]: value };
      return { ...prev, education: newEducation };
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
    const employee = employees.find(emp => emp.id === id);
    if (employee) {
      setDeleteTarget(employee);
      setShowDeleteModal(true);
    }
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      // Check if Supabase is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const useLocalMode = !supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project-url') || supabaseKey.includes('your-anon-key');

      if (useLocalMode) {
        // Local mode - use state only
        setEmployees(employees.filter(emp => emp.id !== deleteTarget.id));
        setShowDeleteModal(false);
        setDeleteTarget(null);
        return;
      }

      try {
        const { error } = await supabase
          .from('employees')
          .delete()
          .eq('id', deleteTarget.id);

        if (error) throw error;

        // Log deleted employee
        await logActivity('delete', 'Employee deleted', `${deleteTarget.last_name}, ${deleteTarget.first_name} was removed from the system`);

        // Refresh employee list
        await fetchEmployees();

        setShowDeleteModal(false);
        setDeleteTarget(null);
      } catch (error) {
        console.error('Error deleting employee:', error.message);
        alert('Failed to delete employee. Please try again.');
      }
    }
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
          /* Hover effect removed */
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
                    {recentActivity.length > 0 ? (
                      recentActivity.map((activity, index) => (
                        <div key={activity.id || index} className="activity-item flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-all">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${activity.type === 'new' ? 'bg-emerald-100' :
                            activity.type === 'update' ? 'bg-blue-100' :
                              activity.type === 'delete' ? 'bg-red-100' :
                                'bg-orange-100'
                            }`}>
                            {activity.type === 'new' && <UserCheck className="w-5 h-5 text-emerald-600" />}
                            {activity.type === 'update' && <Pencil className="w-5 h-5 text-blue-600" />}
                            {activity.type === 'delete' && <Trash2 className="w-5 h-5 text-red-600" />}
                            {!['new', 'update', 'delete'].includes(activity.type) && <Users className="w-5 h-5 text-orange-600" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-slate-800">{activity.title}</p>
                            <p className="text-slate-500 text-sm mt-1">{activity.description}</p>
                          </div>
                          <span className="text-slate-400 text-sm whitespace-nowrap">{formatRelativeTime(activity.created_at)}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-slate-400">No recent activity found.</p>
                      </div>
                    )}
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
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowAllColumns(!showAllColumns)}
                        className="flex items-center gap-2 px-5 py-3 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-all shadow-lg whitespace-nowrap"
                      >
                        {showAllColumns ? (
                          <>
                            <Minimize2 className="w-5 h-5" />
                            Show less
                          </>
                        ) : (
                          <>
                            <Maximize2 className="w-5 h-5" />
                            Show more
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleOpenAddModal}
                        className="btn-primary flex items-center justify-center gap-2 px-6 py-3 text-white rounded-xl font-semibold shadow-lg whitespace-nowrap"
                      >
                        <Plus className="w-5 h-5" />
                        Add Employee
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 flex flex-col">
                  {/* Desktop Table */}
                  <div className="hidden lg:block overflow-x-auto flex-1">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-slate-50 to-indigo-50 border-b-2 border-indigo-100">
                          <th className="px-3 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Emp. ID</th>
                          <th className="px-3 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Name</th>
                          <th className="px-3 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Position</th>
                          <th className="px-3 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Department</th>
                          <th className="px-3 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Birthdate</th>
                          <th className="px-3 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Sex</th>
                          <th className="px-3 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Age</th>
                          {showAllColumns && (
                            <>
                              <th className="px-3 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Address</th>
                              <th className="px-3 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Contact</th>
                              <th className="px-3 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                            </>
                          )}
                          <th className="px-3 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {currentItems.map((employee) => (
                          <tr key={employee.id} className="table-row">
                            <td className="px-3 py-4 whitespace-nowrap">
                              <span className="badge font-bold text-slate-700 text-[13px]">{employee.employee_id || '(No ID)'}</span>
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap">
                              <span className="font-semibold text-slate-800 text-[13px]">{employee.name}</span>
                            </td>
                            <td className="px-3 py-4">
                              <span className="text-slate-600 text-[13px]">{employee.hired_position || employee.position || '-'}</span>
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap">
                              <span className="text-slate-600 text-[13px]">{employee.hired_dept || employee.department || '-'}</span>
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap">
                              <span className="text-slate-500 text-[13px]">
                                {employee.birthday ? new Date(employee.birthday).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                              </span>
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap">
                              <span className="text-slate-600 text-[13px]">{employee.sex || '-'}</span>
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap">
                              <span className="text-slate-600 text-[13px]">{employee.age || '-'}</span>
                            </td>
                            {showAllColumns && (
                              <>
                                <td className="px-3 py-4 max-w-[150px] truncate">
                                  <span className="text-slate-600 text-[13px]">
                                    {employee.city}{employee.city && employee.province ? ', ' : ''}{employee.province}
                                  </span>
                                </td>
                                <td className="px-3 py-4 whitespace-nowrap">
                                  <span className="text-slate-600 text-[13px] font-medium">{employee.contact_number || '-'}</span>
                                </td>
                                <td className="px-3 py-4 whitespace-nowrap">
                                  <span className={`badge px-3 py-1 rounded-full text-[13px] ${employee.status === 'Active'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-slate-100 text-slate-600'
                                    }`}>
                                    {employee.status}
                                  </span>
                                </td>
                              </>
                            )}
                            <td className="px-3 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEditEmployee(employee)}
                                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                  title="Edit"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleViewEmployee(employee)}
                                  className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
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
                          <button
                            onClick={() => handleEditEmployee(employee)}
                            className="flex-1 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-100 transition-all flex items-center justify-center gap-2"
                          >
                            <Pencil className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleViewEmployee(employee)}
                            className="flex-1 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg font-semibold hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View
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
          <div className="modal-content bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            {/* Sticky Header Section */}
            <div className="sticky top-0 z-20 bg-white px-8 pt-8 pb-4 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    {isViewOnly ? 'View Employee Details' : (isEditing ? 'Edit Employee' : 'Add New Employee')}
                  </h2>
                  {!isViewOnly && (
                    <p className="text-slate-500 text-sm mt-1">
                      Step {currentStep} of 6: {
                        currentStep === 1 ? 'Employee Information' :
                          currentStep === 2 ? 'Employment History' :
                            currentStep === 3 ? 'Education & Certificates' :
                              currentStep === 4 ? 'References & Emergency Contact' :
                                currentStep === 5 ? 'Information to the Applicant' :
                                  'Step 6'
                      }
                    </p>
                  )}
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              {!isViewOnly && (
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-500 ease-in-out"
                    style={{ width: `${(currentStep / 6) * 100}%` }}
                  />
                </div>
              )}
            </div>

            <form onSubmit={handleAddEmployee} className="space-y-6 p-8 pt-4">
              {(isViewOnly || currentStep === 1) && (
                <div className="space-y-6 card-enter">
                  {/* Application Metadata */}
                  <div className="space-y-4 mb-8 pb-6 border-b border-slate-100">
                    {/* Employee ID - Full Width Row */}
                    <div className="flex items-center gap-3 justify-center">
                      <label className="text-[13px] font-bold text-slate-700 whitespace-nowrap">Employee ID:</label>
                      <div className="flex items-center border-b-2 border-slate-300 focus-within:border-indigo-600 transition-colors h-8">
                        <span className="text-[13px] font-medium text-slate-800 pl-1 leading-none">EDP NO.</span>
                        <input
                          type="text"
                          value={formData.employeeIdNumber}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                            setFormData({ ...formData, employeeIdNumber: value });
                          }}
                          className="w-14 pl-1 focus:outline-none bg-transparent text-[13px] font-medium text-slate-800 leading-none h-full"
                          disabled={isViewOnly}
                          placeholder="0000"
                          maxLength="4"
                        />
                      </div>
                    </div>

                    {/* Position and Date - Same Row */}
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex-[2] flex items-end gap-3">
                        <label className="text-sm font-bold text-slate-700 whitespace-nowrap">Position applying for:</label>
                        <input
                          type="text"
                          value={formData.positionApplied || ''}
                          onChange={(e) => setFormData({ ...formData, positionApplied: e.target.value })}
                          className="flex-1 px-2 py-1 border-b-2 border-slate-300 focus:border-indigo-600 focus:outline-none bg-transparent text-sm"
                          disabled={isViewOnly}
                          placeholder=""
                        />
                      </div>
                      <div className="flex-1 flex items-end gap-3">
                        <label className="text-sm font-bold text-slate-700 whitespace-nowrap">Date of Application:</label>
                        <input
                          type="date"
                          value={formData.applicationDate || ''}
                          onChange={(e) => setFormData({ ...formData, applicationDate: e.target.value })}
                          className="flex-1 px-2 py-1 border-b-2 border-slate-300 focus:border-indigo-600 focus:outline-none bg-transparent text-sm"
                          disabled={isViewOnly}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Personal Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none"
                        disabled={isViewOnly}
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
                        disabled={isViewOnly}
                        placeholder="D."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none"
                        disabled={isViewOnly}
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  {/* Contact Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Contact Number</label>
                      <input
                        type="tel"
                        value={formData.contactNumber}
                        onChange={(e) => {
                          const numericValue = e.target.value.replace(/\D/g, '').slice(0, 11);
                          setFormData({ ...formData, contactNumber: numericValue });
                        }}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none"
                        disabled={isViewOnly}
                        placeholder="09123456789"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none"
                        disabled={isViewOnly}
                        placeholder="john.doe@company.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Birthday</label>
                      <input
                        type="date"
                        value={formData.birthday}
                        onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none"
                        disabled={isViewOnly}
                      />
                    </div>
                  </div>

                  {/* Other Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Age</label>
                      <input
                        type="number"
                        readOnly
                        value={formData.age}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 text-slate-500 focus:outline-none"
                        disabled={isViewOnly}
                        placeholder="Age"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none"
                        disabled={isViewOnly}
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
                        disabled={isViewOnly}
                      >
                        <option value="">Select Sex</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>

                  {/* Address Section */}
                  <div className="border-t border-slate-100 pt-4">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Address Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Region</label>
                        <select
                          value={formData.regionCode}
                          onChange={handleRegionChange}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none"
                          disabled={isViewOnly}
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
                          value={formData.provinceCode}
                          onChange={handleProvinceChange}
                          disabled={isViewOnly || !formData.regionCode}
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
                          value={formData.cityCode}
                          onChange={handleCityChange}
                          disabled={isViewOnly || !formData.provinceCode}
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
                          value={formData.barangay}
                          onChange={(e) => setFormData({ ...formData, barangay: e.target.value })}
                          disabled={isViewOnly || !formData.cityCode}
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
                          disabled={isViewOnly}
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
                          disabled={isViewOnly}
                          placeholder="Zip Code"
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex flex-col items-start gap-2">
                          <label className="text-sm font-semibold text-slate-700">Can you perform the position's essential functions</label>
                          <div className="flex items-center space-x-6">
                            <span className="text-sm font-semibold text-slate-700">with or without accommodations?</span>
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={formData.essentialFunctions === 'Yes'}
                                onChange={(e) => !isViewOnly && setFormData({ ...formData, essentialFunctions: 'Yes' })}
                                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                disabled={isViewOnly}
                              />
                              <span className="text-slate-700">Yes</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={formData.essentialFunctions === 'No'}
                                onChange={(e) => !isViewOnly && setFormData({ ...formData, essentialFunctions: 'No' })}
                                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                disabled={isViewOnly}
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
                                onChange={(e) => !isViewOnly && setFormData({ ...formData, permanent: 'Yes' })}
                                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                disabled={isViewOnly}
                              />
                              <span className="text-slate-700">Yes</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={formData.permanent === 'No'}
                                onChange={(e) => !isViewOnly && setFormData({ ...formData, permanent: 'No' })}
                                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                disabled={isViewOnly}
                              />
                              <span className="text-slate-700">No</span>
                            </label>
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-slate-700 mb-2">How did you hear about the position?</label>
                          <input
                            type="text"
                            value={formData.heardAboutPosition}
                            onChange={(e) => setFormData({ ...formData, heardAboutPosition: e.target.value })}
                            className="w-1/2 px-2 pt-2 pb-4 border-b-4 border-slate-300 focus:border-indigo-600 focus:outline-none bg-transparent"
                            disabled={isViewOnly}
                            placeholder="Min. of 200 characters"
                          />
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 mb-4">
                          <div className="w-full md:w-1/2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Have you ever worked for this company?</label>
                            <div className="flex items-center space-x-6 pt-2">
                              <label className="flex items-center space-x-2 cursor-pointer group">
                                <input
                                  type="checkbox"
                                  checked={formData.workedBefore === 'Yes'}
                                  onChange={(e) => !isViewOnly && setFormData({ ...formData, workedBefore: 'Yes' })}
                                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all group-hover:border-indigo-400"
                                  disabled={isViewOnly}
                                />
                                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Yes</span>
                              </label>
                              <label className="flex items-center space-x-2 cursor-pointer group">
                                <input
                                  type="checkbox"
                                  checked={formData.workedBefore === 'No'}
                                  onChange={(e) => !isViewOnly && setFormData({ ...formData, workedBefore: 'No', workedWhen: '' })}
                                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all group-hover:border-indigo-400"
                                  disabled={isViewOnly}
                                />
                                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">No</span>
                              </label>
                            </div>
                          </div>
                          <div className="w-full md:w-1/2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">If yes, when?</label>
                            <input
                              type="date"
                              value={formData.workedWhen}
                              onChange={(e) => setFormData({ ...formData, workedWhen: e.target.value })}
                              className={`w-full px-2 pt-2 pb-4 border-b-4 border-slate-300 focus:border-indigo-600 focus:outline-none bg-transparent transition-opacity ${formData.workedBefore !== 'Yes' ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
                              disabled={isViewOnly || formData.workedBefore !== 'Yes'}
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
                                    onChange={(e) => !isViewOnly && setFormData({ ...formData, canWorkOvertime: 'Yes' })}
                                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all group-hover:border-indigo-400"
                                    disabled={isViewOnly}
                                  />
                                  <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Yes</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer group">
                                  <input
                                    type="checkbox"
                                    checked={formData.canWorkOvertime === 'No'}
                                    onChange={(e) => !isViewOnly && setFormData({ ...formData, canWorkOvertime: 'No' })}
                                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all group-hover:border-indigo-400"
                                    disabled={isViewOnly}
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
                                    onChange={(e) => !isViewOnly && setFormData({ ...formData, hasDriversLicense: 'Yes' })}
                                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all group-hover:border-indigo-400"
                                    disabled={isViewOnly}
                                  />
                                  <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Yes</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer group">
                                  <input
                                    type="checkbox"
                                    checked={formData.hasDriversLicense === 'No'}
                                    onChange={(e) => !isViewOnly && setFormData({ ...formData, hasDriversLicense: 'No' })}
                                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all group-hover:border-indigo-400"
                                    disabled={isViewOnly}
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
                                  disabled={isViewOnly || formData.hasDriversLicense !== 'Yes'}
                                  placeholder="State Name"
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
                                  disabled={isViewOnly || !formData.shifts.includes('Other')}
                                  placeholder="Specify..."
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
                                disabled={isViewOnly}
                                placeholder="Shift details"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {(isViewOnly || currentStep === 2) && (
                <div className="space-y-6 card-enter">
                  <p className="text-sm text-slate-500">List most recent employment first.</p>

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
                                      disabled={isViewOnly}
                                      placeholder="..."
                                    />
                                    <input
                                      type="text"
                                      value={formData.employmentHistory[rowIndex].nameAddress2}
                                      onChange={(e) => handleEmploymentChange(rowIndex, 'nameAddress2', e.target.value)}
                                      className="w-full border-b border-slate-300 focus:border-indigo-600 focus:outline-none bg-transparent text-sm pb-1"
                                      disabled={isViewOnly}
                                      placeholder="..."
                                    />
                                    <input
                                      type="text"
                                      value={formData.employmentHistory[rowIndex].nameAddress3}
                                      onChange={(e) => handleEmploymentChange(rowIndex, 'nameAddress3', e.target.value)}
                                      className="w-full border-b border-slate-300 focus:border-indigo-600 focus:outline-none bg-transparent text-sm pb-1"
                                      disabled={isViewOnly}
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
                                    disabled={isViewOnly} placeholder="..."
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
                                    disabled={isViewOnly} placeholder="..."
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
                                      disabled={isViewOnly} placeholder="..."
                                    />
                                    <input
                                      type="text"
                                      value={formData.employmentHistory[rowIndex].posSkills2}
                                      onChange={(e) => handleEmploymentChange(rowIndex, 'posSkills2', e.target.value)}
                                      className="w-full border-b border-slate-300 focus:border-indigo-600 focus:outline-none bg-transparent text-sm pb-1"
                                      disabled={isViewOnly} placeholder="..."
                                    />
                                    <input
                                      type="text"
                                      value={formData.employmentHistory[rowIndex].posSkills3}
                                      onChange={(e) => handleEmploymentChange(rowIndex, 'posSkills3', e.target.value)}
                                      className="w-full border-b border-slate-300 focus:border-indigo-600 focus:outline-none bg-transparent text-sm pb-1"
                                      disabled={isViewOnly} placeholder="..."
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
                                    disabled={isViewOnly} placeholder="..."
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
                                    disabled={isViewOnly} placeholder="..."
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
                                      disabled={isViewOnly} placeholder="..."
                                    />
                                    <input
                                      type="text"
                                      value={formData.employmentHistory[rowIndex].reasonLeaving2}
                                      onChange={(e) => handleEmploymentChange(rowIndex, 'reasonLeaving2', e.target.value)}
                                      className="w-full border-b border-slate-300 focus:border-indigo-600 focus:outline-none bg-transparent text-sm pb-1"
                                      disabled={isViewOnly} placeholder="..."
                                    />
                                    <input
                                      type="text"
                                      value={formData.employmentHistory[rowIndex].reasonLeaving3}
                                      onChange={(e) => handleEmploymentChange(rowIndex, 'reasonLeaving3', e.target.value)}
                                      className="w-full border-b border-slate-300 focus:border-indigo-600 focus:outline-none bg-transparent text-sm pb-1"
                                      disabled={isViewOnly} placeholder="..."
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
              )}
              {(isViewOnly || currentStep === 3) && (
                <div className="space-y-6 card-enter">
                  <div className="bg-white p-6 rounded-2xl border-2 border-slate-200">
                    <h3 className="text-base font-bold text-slate-800 mb-6 text-center">EDUCATION</h3>

                    <div className="overflow-hidden border-2 border-slate-200 rounded-xl">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gradient-to-r from-slate-50 to-indigo-50 border-b-2 border-indigo-100">
                            <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider border-r-2 border-slate-200"></th>
                            <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider border-r-2 border-slate-200">Institution Name</th>
                            <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider border-r-2 border-slate-200">Years Completed</th>
                            <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider border-r-2 border-slate-200">Field of Study</th>
                            <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Graduate or Degree</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.education.map((edu, index) => (
                            <tr key={index} className={index !== 3 ? "border-b-2 border-slate-200" : ""}>
                              <td className="py-3 px-4 border-r-2 border-slate-200 bg-slate-50">
                                <span className="text-sm font-bold text-slate-700">{edu.level}</span>
                              </td>
                              <td className="p-2 border-r-2 border-slate-200">
                                <input
                                  type="text"
                                  value={edu.institution}
                                  onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                                  className="w-full bg-transparent focus:outline-none text-sm px-2 py-1"
                                  disabled={isViewOnly} placeholder="..."
                                />
                              </td>
                              <td className="p-2 border-r-2 border-slate-200">
                                <input
                                  type="text"
                                  value={edu.years}
                                  onChange={(e) => handleEducationChange(index, 'years', e.target.value)}
                                  className="w-full bg-transparent focus:outline-none text-sm px-2 py-1"
                                  disabled={isViewOnly} placeholder="..."
                                />
                              </td>
                              <td className="p-2 border-r-2 border-slate-200">
                                <input
                                  type="text"
                                  value={edu.field}
                                  onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
                                  className="w-full bg-transparent focus:outline-none text-sm px-2 py-1"
                                  disabled={isViewOnly} placeholder="..."
                                />
                              </td>
                              <td className="p-2">
                                <input
                                  type="text"
                                  value={edu.degree}
                                  onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                                  className="w-full bg-transparent focus:outline-none text-sm px-2 py-1"
                                  disabled={isViewOnly} placeholder="..."
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border-2 border-slate-200">
                    <h3 className="text-base font-bold text-slate-800 mb-6 text-center">CERTIFICATE / VOCATIONAL COURSE</h3>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-6">
                        <label className="text-sm font-semibold text-slate-700">Do you have NCII?</label>
                        <div className="flex items-center space-x-6">
                          <label className="flex items-center space-x-2 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={formData.hasNCII === 'Yes'}
                              onChange={() => setFormData({ ...formData, hasNCII: 'Yes' })}
                              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all group-hover:border-indigo-400"
                            />
                            <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Yes</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={formData.hasNCII === 'No'}
                              onChange={() => setFormData({ ...formData, hasNCII: 'No', specializedTraining: '' })}
                              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all group-hover:border-indigo-400"
                            />
                            <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">No</span>
                          </label>
                        </div>
                      </div>

                      {formData.hasNCII === 'Yes' && (
                        <div className="flex items-center gap-2 ml-4 transition-all duration-300">
                          <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">Duty/specialized training:</label>
                          <input
                            type="text"
                            value={formData.specializedTraining}
                            onChange={(e) => setFormData({ ...formData, specializedTraining: e.target.value })}
                            className="flex-1 px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none text-sm"
                            disabled={isViewOnly}
                            placeholder="Enter specialized training details..."
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border-2 border-slate-200">
                    <h3 className="text-base font-bold text-slate-800 mb-6 text-center">SKILLS & QUALIFICATIONS</h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Other qualifications such as special skills, abilities, or honors that should be considered:
                        </label>
                        <input
                          type="text"
                          value={formData.otherQualifications}
                          onChange={(e) => setFormData({ ...formData, otherQualifications: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none text-sm"
                          disabled={isViewOnly}
                          placeholder="Enter qualifications..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Types of computers, software, and other equipment you are qualified to operate or repair:
                        </label>
                        <input
                          type="text"
                          value={formData.computerEquipment}
                          onChange={(e) => setFormData({ ...formData, computerEquipment: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none text-sm"
                          disabled={isViewOnly}
                          placeholder="Enter computer/software/equipment skills..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Professional licenses, certifications, or registrations:
                        </label>
                        <input
                          type="text"
                          value={formData.professionalLicenses}
                          onChange={(e) => setFormData({ ...formData, professionalLicenses: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none text-sm"
                          disabled={isViewOnly}
                          placeholder="Enter licenses/certifications..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Additional skills, including supervision skills, other languages, or information regarding the career/occupation you wish to bring to the employer's attention:
                        </label>
                        <input
                          type="text"
                          value={formData.additionalSkills}
                          onChange={(e) => setFormData({ ...formData, additionalSkills: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none text-sm"
                          disabled={isViewOnly}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {(isViewOnly || currentStep === 4) && (
                <div className="space-y-6 card-enter">
                  <div className="bg-white p-6 rounded-2xl border-2 border-slate-200">
                    <h3 className="text-base font-bold text-slate-800 mb-4 text-center">REFERENCES</h3>
                    <p className="text-sm text-slate-600 mb-6 text-center">
                      List two personal references who are not relatives or former supervisors
                    </p>

                    <div className="space-y-8">
                      {/* Reference 1 */}
                      <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-200">
                        <h4 className="text-sm font-bold text-slate-700 mb-4">Reference 1</h4>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
                              <input
                                type="text"
                                value={formData.references[0].lastName}
                                onChange={(e) => {
                                  const newRefs = [...formData.references];
                                  newRefs[0] = { ...newRefs[0], lastName: e.target.value };
                                  setFormData({ ...formData, references: newRefs });
                                }}
                                className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none text-sm"
                                disabled={isViewOnly}
                                placeholder="Last Name"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
                              <input
                                type="text"
                                value={formData.references[0].firstName}
                                onChange={(e) => {
                                  const newRefs = [...formData.references];
                                  newRefs[0] = { ...newRefs[0], firstName: e.target.value };
                                  setFormData({ ...formData, references: newRefs });
                                }}
                                className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none text-sm"
                                disabled={isViewOnly}
                                placeholder="First Name"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">Middle Name</label>
                              <input
                                type="text"
                                value={formData.references[0].middleName}
                                onChange={(e) => {
                                  const newRefs = [...formData.references];
                                  newRefs[0] = { ...newRefs[0], middleName: e.target.value };
                                  setFormData({ ...formData, references: newRefs });
                                }}
                                className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none text-sm"
                                disabled={isViewOnly}
                                placeholder="Middle Name"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Address</label>
                            <input
                              type="text"
                              value={formData.references[0].address}
                              onChange={(e) => {
                                const newRefs = [...formData.references];
                                newRefs[0] = { ...newRefs[0], address: e.target.value };
                                setFormData({ ...formData, references: newRefs });
                              }}
                              className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none text-sm"
                              disabled={isViewOnly}
                              placeholder="Complete Address"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">Telephone</label>
                              <input
                                type="text"
                                value={formData.references[0].telephone}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/\D/g, '').slice(0, 11);
                                  const newRefs = [...formData.references];
                                  newRefs[0] = { ...newRefs[0], telephone: val };
                                  setFormData({ ...formData, references: newRefs });
                                }}
                                className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none text-sm"
                                disabled={isViewOnly} placeholder="11 digits"
                                maxLength="11"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">Occupation</label>
                              <input
                                type="text"
                                value={formData.references[0].occupation}
                                onChange={(e) => {
                                  const newRefs = [...formData.references];
                                  newRefs[0] = { ...newRefs[0], occupation: e.target.value };
                                  setFormData({ ...formData, references: newRefs });
                                }}
                                className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none text-sm"
                                disabled={isViewOnly}
                                placeholder="Occupation"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">Years Known</label>
                              <input
                                type="text"
                                value={formData.references[0].yearsKnown}
                                onChange={(e) => {
                                  const newRefs = [...formData.references];
                                  newRefs[0] = { ...newRefs[0], yearsKnown: e.target.value };
                                  setFormData({ ...formData, references: newRefs });
                                }}
                                className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none text-sm"
                                disabled={isViewOnly}
                                placeholder="Years"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Reference 2 */}
                      <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-200">
                        <h4 className="text-sm font-bold text-slate-700 mb-4">Reference 2</h4>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
                              <input
                                type="text"
                                value={formData.references[1].lastName}
                                onChange={(e) => {
                                  const newRefs = [...formData.references];
                                  newRefs[1] = { ...newRefs[1], lastName: e.target.value };
                                  setFormData({ ...formData, references: newRefs });
                                }}
                                className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none text-sm"
                                disabled={isViewOnly}
                                placeholder="Last Name"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
                              <input
                                type="text"
                                value={formData.references[1].firstName}
                                onChange={(e) => {
                                  const newRefs = [...formData.references];
                                  newRefs[1] = { ...newRefs[1], firstName: e.target.value };
                                  setFormData({ ...formData, references: newRefs });
                                }}
                                className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none text-sm"
                                disabled={isViewOnly}
                                placeholder="First Name"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">Middle Name</label>
                              <input
                                type="text"
                                value={formData.references[1].middleName}
                                onChange={(e) => {
                                  const newRefs = [...formData.references];
                                  newRefs[1] = { ...newRefs[1], middleName: e.target.value };
                                  setFormData({ ...formData, references: newRefs });
                                }}
                                className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none text-sm"
                                disabled={isViewOnly}
                                placeholder="Middle Name"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Address</label>
                            <input
                              type="text"
                              value={formData.references[1].address}
                              onChange={(e) => {
                                const newRefs = [...formData.references];
                                newRefs[1] = { ...newRefs[1], address: e.target.value };
                                setFormData({ ...formData, references: newRefs });
                              }}
                              className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none text-sm"
                              disabled={isViewOnly}
                              placeholder="Complete Address"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">Telephone</label>
                              <input
                                type="text"
                                value={formData.references[1].telephone}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/\D/g, '').slice(0, 11);
                                  const newRefs = [...formData.references];
                                  newRefs[1] = { ...newRefs[1], telephone: val };
                                  setFormData({ ...formData, references: newRefs });
                                }}
                                className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none text-sm"
                                disabled={isViewOnly} placeholder="11 digits"
                                maxLength="11"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">Occupation</label>
                              <input
                                type="text"
                                value={formData.references[1].occupation}
                                onChange={(e) => {
                                  const newRefs = [...formData.references];
                                  newRefs[1] = { ...newRefs[1], occupation: e.target.value };
                                  setFormData({ ...formData, references: newRefs });
                                }}
                                className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none text-sm"
                                disabled={isViewOnly}
                                placeholder="Occupation"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">Years Known</label>
                              <input
                                type="text"
                                value={formData.references[1].yearsKnown}
                                onChange={(e) => {
                                  const newRefs = [...formData.references];
                                  newRefs[1] = { ...newRefs[1], yearsKnown: e.target.value };
                                  setFormData({ ...formData, references: newRefs });
                                }}
                                className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none text-sm"
                                disabled={isViewOnly}
                                placeholder="Years"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                  <div className="bg-white p-6 rounded-2xl border-2 border-slate-200">
                    <h3 className="text-base font-bold text-slate-800 mb-6 text-center uppercase">In Case of Emergency</h3>

                    <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-200">
                      <h4 className="text-sm font-bold text-slate-700 mb-4">In case of accident or illness, please get in touch with:</h4>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
                            <input
                              type="text"
                              value={formData.emergencyContact.name}
                              onChange={(e) => setFormData({
                                ...formData,
                                emergencyContact: { ...formData.emergencyContact, name: e.target.value }
                              })}
                              className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none text-sm"
                              disabled={isViewOnly}
                              placeholder="Contact Name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Relationship</label>
                            <input
                              type="text"
                              value={formData.emergencyContact.relationship}
                              onChange={(e) => setFormData({
                                ...formData,
                                emergencyContact: { ...formData.emergencyContact, relationship: e.target.value }
                              })}
                              className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none text-sm"
                              disabled={isViewOnly}
                              placeholder="Relationship"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Address</label>
                            <input
                              type="text"
                              value={formData.emergencyContact.address}
                              onChange={(e) => setFormData({
                                ...formData,
                                emergencyContact: { ...formData.emergencyContact, address: e.target.value }
                              })}
                              className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none text-sm"
                              disabled={isViewOnly}
                              placeholder="Complete Address"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Cellphone #</label>
                            <input
                              type="text"
                              value={formData.emergencyContact.contactNumber}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 11);
                                setFormData({
                                  ...formData,
                                  emergencyContact: { ...formData.emergencyContact, contactNumber: val }
                                });
                              }}
                              className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none text-sm"
                              disabled={isViewOnly} placeholder="11 digits"
                              maxLength="11"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {(isViewOnly || currentStep === 5) && (
                <div className="space-y-6 card-enter">
                  <div className="bg-white p-6 rounded-2xl border-2 border-slate-200">
                    <h3 className="text-base font-bold text-slate-800 mb-6 text-center uppercase tracking-wider">INFORMATION TO THE APPLICANT</h3>

                    <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
                      <p>
                        As part of our procedure for processing your employment application, your personal and employment references may be checked. If you have misrepresented or omitted any facts on this application, and are subsequently hired, you may be discharged from your job. You may make a written request for information derived from the checking of your references.
                      </p>
                      <p>
                        If necessary for employment, you may be required to: supply your birth certificate or other proof of authorization to work in the EDP Engineering Services, have a physical examination and/or a drug test, or sign a conflict-of-interest agreement and abide by its terms. I understand and agree with the information shown above.
                      </p>

                      <div className="pt-8 mt-8 border-t border-slate-200">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                          <div className="w-full md:w-[70%]">
                            <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider text-center">
                              Signature of Applicant (Draw with Mouse/Touch)
                            </label>
                            <SignaturePad
                              value={formData.applicantSignature || ''}
                              onChange={(val) => setFormData({ ...formData, applicantSignature: val })}
                              disabled={isViewOnly}
                            />
                            <p className="text-[10px] text-slate-400 mt-2 text-center italic">Sign inside the box above</p>
                          </div>
                          <div className="w-full md:w-[25%]">
                            <input
                              type="date"
                              value={formData.dateSigned}
                              onChange={(e) => setFormData({ ...formData, dateSigned: e.target.value })}
                              className="w-full px-2 pt-2 pb-1 border-b-2 border-slate-400 focus:border-indigo-600 focus:outline-none bg-transparent text-center"
                              disabled={isViewOnly}
                            />
                            <label className="block text-xs font-bold text-slate-500 mt-2 text-center uppercase tracking-wider">
                              Date
                            </label>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}
              {(isViewOnly || currentStep === 6) && (
                <div className="space-y-6 card-enter">
                  <div className="bg-white p-6 rounded-2xl border-2 border-slate-200">

                    <div className="space-y-8 py-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">INTERVIEWED BY:</label>
                          <input
                            type="text"
                            value={formData.interviewedBy || ''}
                            onChange={(e) => setFormData({ ...formData, interviewedBy: e.target.value })}
                            className="w-full px-2 pt-2 pb-1 border-b-2 border-slate-400 focus:border-indigo-600 focus:outline-none bg-transparent"
                            disabled={isViewOnly}
                            placeholder="Enter interviewer name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">DATE:</label>
                          <input
                            type="date"
                            value={formData.interviewDate || ''}
                            onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
                            className="w-full px-2 pt-2 pb-1 border-b-2 border-slate-400 focus:border-indigo-600 focus:outline-none bg-transparent"
                            disabled={isViewOnly}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">REMARKS:</label>
                        <div className="space-y-4">
                          <input
                            type="text"
                            value={formData.remarks1 || ''}
                            onChange={(e) => setFormData({ ...formData, remarks1: e.target.value })}
                            className="w-full px-2 pt-2 pb-1 border-b-2 border-slate-400 focus:border-indigo-600 focus:outline-none bg-transparent"
                            disabled={isViewOnly}
                          />
                          <input
                            type="text"
                            value={formData.remarks2 || ''}
                            onChange={(e) => setFormData({ ...formData, remarks2: e.target.value })}
                            className="w-full px-2 pt-2 pb-1 border-b-2 border-slate-400 focus:border-indigo-600 focus:outline-none bg-transparent"
                            disabled={isViewOnly}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">NEATNESS:</label>
                          <input
                            type="text"
                            value={formData.neatness || ''}
                            onChange={(e) => setFormData({ ...formData, neatness: e.target.value })}
                            className="w-full px-2 pt-2 pb-1 border-b-2 border-slate-400 focus:border-indigo-600 focus:outline-none bg-transparent"
                            disabled={isViewOnly}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">ABILITY:</label>
                          <input
                            type="text"
                            value={formData.ability || ''}
                            onChange={(e) => setFormData({ ...formData, ability: e.target.value })}
                            className="w-full px-2 pt-2 pb-1 border-b-2 border-slate-400 focus:border-indigo-600 focus:outline-none bg-transparent"
                            disabled={isViewOnly}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">HIRED:</label>
                          <div className="flex gap-6 pt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.hired === 'Yes'}
                                onChange={(e) => setFormData({ ...formData, hired: e.target.checked ? 'Yes' : '' })}
                                disabled={isViewOnly}
                                className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                              />
                              <span className="text-sm text-slate-700">Yes</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.hired === 'No'}
                                onChange={(e) => setFormData({ ...formData, hired: e.target.checked ? 'No' : '' })}
                                disabled={isViewOnly}
                                className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                              />
                              <span className="text-sm text-slate-700">No</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">POSITION:</label>
                          <input
                            type="text"
                            value={formData.hiredPosition || ''}
                            onChange={(e) => setFormData({ ...formData, hiredPosition: e.target.value })}
                            className="w-full px-2 pt-2 pb-1 border-b-2 border-slate-400 focus:border-indigo-600 focus:outline-none bg-transparent"
                            disabled={isViewOnly}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">DEPT:</label>
                          <input
                            type="text"
                            value={formData.hiredDept || ''}
                            onChange={(e) => setFormData({ ...formData, hiredDept: e.target.value })}
                            className="w-full px-2 pt-2 pb-1 border-b-2 border-slate-400 focus:border-indigo-600 focus:outline-none bg-transparent"
                            disabled={isViewOnly}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">SALARY/WAGE:</label>
                          <input
                            type="text"
                            value={formData.salaryWage || ''}
                            onChange={(e) => setFormData({ ...formData, salaryWage: e.target.value })}
                            className="w-full px-2 pt-2 pb-1 border-b-2 border-slate-400 focus:border-indigo-600 focus:outline-none bg-transparent"
                            disabled={isViewOnly}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">DATE OF REPORTING TO WORK:</label>
                          <input
                            type="date"
                            value={formData.reportingDate || ''}
                            onChange={(e) => setFormData({ ...formData, reportingDate: e.target.value })}
                            className="w-full px-2 pt-2 pb-1 border-b-2 border-slate-400 focus:border-indigo-600 focus:outline-none bg-transparent"
                            disabled={isViewOnly}
                          />
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-slate-200">
                        <h4 className="text-base font-bold text-red-600 mb-4 uppercase tracking-wider">REQUIREMENTS</h4>

                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">SSS NO.:</label>
                              <input
                                type="text"
                                value={formData.sssNo || ''}
                                onChange={(e) => setFormData({ ...formData, sssNo: e.target.value })}
                                className="w-full px-2 pt-2 pb-1 border-b-2 border-slate-400 focus:border-indigo-600 focus:outline-none bg-transparent"
                                disabled={isViewOnly}
                              />
                            </div>
                            <div>
                              <label className="flex items-center gap-2 cursor-pointer pt-6">
                                <input
                                  type="checkbox"
                                  checked={formData.hasBirthCertificate || false}
                                  onChange={(e) => setFormData({ ...formData, hasBirthCertificate: e.target.checked })}
                                  disabled={isViewOnly}
                                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                />
                                <span className="text-sm font-semibold text-slate-700">BIRTH CERTIFICATE</span>
                              </label>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">PHILHEALTH NO.:</label>
                              <input
                                type="text"
                                value={formData.philhealthNo || ''}
                                onChange={(e) => setFormData({ ...formData, philhealthNo: e.target.value })}
                                className="w-full px-2 pt-2 pb-1 border-b-2 border-slate-400 focus:border-indigo-600 focus:outline-none bg-transparent"
                                disabled={isViewOnly}
                              />
                            </div>
                            <div>
                              <label className="flex items-center gap-2 cursor-pointer pt-6">
                                <input
                                  type="checkbox"
                                  checked={formData.hasMarriageContract || false}
                                  onChange={(e) => setFormData({ ...formData, hasMarriageContract: e.target.checked })}
                                  disabled={isViewOnly}
                                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                />
                                <span className="text-sm font-semibold text-slate-700">MARRIAGE CONTRACT IF APPLICABLE</span>
                              </label>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">PAG-IBIG NO.:</label>
                              <input
                                type="text"
                                value={formData.pagibigNo || ''}
                                onChange={(e) => setFormData({ ...formData, pagibigNo: e.target.value })}
                                className="w-full px-2 pt-2 pb-1 border-b-2 border-slate-400 focus:border-indigo-600 focus:outline-none bg-transparent"
                                disabled={isViewOnly}
                              />
                            </div>
                            <div>
                              <label className="flex items-center gap-2 cursor-pointer pt-6">
                                <input
                                  type="checkbox"
                                  checked={formData.hasNciiCertificate || false}
                                  onChange={(e) => setFormData({ ...formData, hasNciiCertificate: e.target.checked })}
                                  disabled={isViewOnly}
                                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                />
                                <span className="text-sm font-semibold text-slate-700">NCII CERTIFICATES EXPIRED OR NOT EXPIRED</span>
                              </label>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">TIN NO.:</label>
                              <input
                                type="text"
                                value={formData.tinNo || ''}
                                onChange={(e) => setFormData({ ...formData, tinNo: e.target.value })}
                                className="w-full px-2 pt-2 pb-1 border-b-2 border-slate-400 focus:border-indigo-600 focus:outline-none bg-transparent"
                                disabled={isViewOnly}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-slate-200">
                        <h4 className="text-base font-bold text-red-600 mb-4 uppercase tracking-wider">FOR NPI BIOMETRICS</h4>

                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                              <label className="flex items-center gap-2 cursor-pointer mb-2">
                                <input
                                  type="checkbox"
                                  checked={formData.hasNbi || false}
                                  onChange={(e) => setFormData({ ...formData, hasNbi: e.target.checked })}
                                  disabled={isViewOnly}
                                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                />
                                <span className="text-sm font-semibold text-slate-700">NBI</span>
                              </label>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">EXPIRY DATE:</label>
                              <input
                                type="date"
                                value={formData.nbiExpiryDate || ''}
                                onChange={(e) => setFormData({ ...formData, nbiExpiryDate: e.target.value })}
                                className="w-full px-2 pt-2 pb-1 border-b-2 border-slate-400 focus:border-indigo-600 focus:outline-none bg-transparent"
                                disabled={isViewOnly}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                              <label className="flex items-center gap-2 cursor-pointer mb-2">
                                <input
                                  type="checkbox"
                                  checked={formData.hasEmploymentContract || false}
                                  onChange={(e) => setFormData({ ...formData, hasEmploymentContract: e.target.checked })}
                                  disabled={isViewOnly}
                                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                />
                                <span className="text-sm font-semibold text-slate-700">EMPLOYMENT CONTRACT</span>
                              </label>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">EXPIRY DATE:</label>
                              <input
                                type="date"
                                value={formData.employmentContractExpiryDate || ''}
                                onChange={(e) => setFormData({ ...formData, employmentContractExpiryDate: e.target.value })}
                                className="w-full px-2 pt-2 pb-1 border-b-2 border-slate-400 focus:border-indigo-600 focus:outline-none bg-transparent"
                                disabled={isViewOnly}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                              <label className="flex items-center gap-2 cursor-pointer mb-2">
                                <input
                                  type="checkbox"
                                  checked={formData.hasDrugTest || false}
                                  onChange={(e) => setFormData({ ...formData, hasDrugTest: e.target.checked })}
                                  disabled={isViewOnly}
                                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                />
                                <span className="text-sm font-semibold text-slate-700">DRUG TEST</span>
                              </label>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">EXPIRY DATE:</label>
                              <input
                                type="date"
                                value={formData.drugTestExpiryDate || ''}
                                onChange={(e) => setFormData({ ...formData, drugTestExpiryDate: e.target.value })}
                                className="w-full px-2 pt-2 pb-1 border-b-2 border-slate-400 focus:border-indigo-600 focus:outline-none bg-transparent"
                                disabled={isViewOnly}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                              <label className="flex items-center gap-2 cursor-pointer mb-2">
                                <input
                                  type="checkbox"
                                  checked={formData.hasHealthCard || false}
                                  onChange={(e) => setFormData({ ...formData, hasHealthCard: e.target.checked })}
                                  disabled={isViewOnly}
                                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                />
                                <span className="text-sm font-semibold text-slate-700">HEALTH CARD</span>
                              </label>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">EXPIRY DATE:</label>
                              <input
                                type="date"
                                value={formData.healthCardExpiryDate || ''}
                                onChange={(e) => setFormData({ ...formData, healthCardExpiryDate: e.target.value })}
                                className="w-full px-2 pt-2 pb-1 border-b-2 border-slate-400 focus:border-indigo-600 focus:outline-none bg-transparent"
                                disabled={isViewOnly}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">STATUS:</label>
                              <input
                                type="text"
                                value={formData.healthCardStatus || ''}
                                onChange={(e) => setFormData({ ...formData, healthCardStatus: e.target.value })}
                                className="w-full px-2 pt-2 pb-1 border-b-2 border-slate-400 focus:border-indigo-600 focus:outline-none bg-transparent"
                                disabled={isViewOnly}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                              <label className="flex items-center gap-2 cursor-pointer mb-2">
                                <input
                                  type="checkbox"
                                  checked={formData.hasBarangayClearance || false}
                                  onChange={(e) => setFormData({ ...formData, hasBarangayClearance: e.target.checked })}
                                  disabled={isViewOnly}
                                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                />
                                <span className="text-sm font-semibold text-slate-700">BRG BRGY. CLEARANCE</span>
                              </label>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">EXPIRY DATE:</label>
                              <input
                                type="date"
                                value={formData.barangayClearanceExpiryDate || ''}
                                onChange={(e) => setFormData({ ...formData, barangayClearanceExpiryDate: e.target.value })}
                                className="w-full px-2 pt-2 pb-1 border-b-2 border-slate-400 focus:border-indigo-600 focus:outline-none bg-transparent"
                                disabled={isViewOnly}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                              <label className="flex items-center gap-2 cursor-pointer mb-2">
                                <input
                                  type="checkbox"
                                  checked={formData.hasQuitclaim || false}
                                  onChange={(e) => setFormData({ ...formData, hasQuitclaim: e.target.checked })}
                                  disabled={isViewOnly}
                                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                />
                                <span className="text-sm font-semibold text-slate-700">QUITCLAIM IF APPLICABLE</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-slate-200">
                        <h4 className="text-base font-bold text-red-600 mb-4 uppercase tracking-wider">UNIFORM</h4>

                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                              <label className="flex items-center gap-2 cursor-pointer mb-2">
                                <input
                                  type="checkbox"
                                  checked={formData.hasLongPants || false}
                                  onChange={(e) => setFormData({ ...formData, hasLongPants: e.target.checked })}
                                  disabled={isViewOnly}
                                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                />
                                <span className="text-sm font-semibold text-slate-700">LONG PANTS</span>
                              </label>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">QTY:</label>
                              <input
                                type="text"
                                value={formData.longPantsQty || ''}
                                onChange={(e) => setFormData({ ...formData, longPantsQty: e.target.value })}
                                className="w-full px-2 pt-2 pb-1 border-b-2 border-slate-400 focus:border-indigo-600 focus:outline-none bg-transparent"
                                disabled={isViewOnly}
                              />
                            </div>
                            <div className="flex gap-4">
                              <label className="flex items-center gap-2 cursor-pointer pt-6">
                                <input
                                  type="checkbox"
                                  checked={formData.hasPvcId || false}
                                  onChange={(e) => setFormData({ ...formData, hasPvcId: e.target.checked })}
                                  disabled={isViewOnly}
                                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                />
                                <span className="text-sm font-semibold text-slate-700">PVC ID</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer pt-6">
                                <input
                                  type="checkbox"
                                  checked={formData.hasSling || false}
                                  onChange={(e) => setFormData({ ...formData, hasSling: e.target.checked })}
                                  disabled={isViewOnly}
                                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                />
                                <span className="text-sm font-semibold text-slate-700">SLING</span>
                              </label>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div>
                              <label className="flex items-center gap-2 cursor-pointer mb-2">
                                <input
                                  type="checkbox"
                                  checked={formData.hasLongSleeves || false}
                                  onChange={(e) => setFormData({ ...formData, hasLongSleeves: e.target.checked })}
                                  disabled={isViewOnly}
                                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                />
                                <span className="text-sm font-semibold text-slate-700">LONG SLEEVES</span>
                              </label>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">BROWN QTY.:</label>
                              <input
                                type="text"
                                value={formData.longSleevesBrownQty || ''}
                                onChange={(e) => setFormData({ ...formData, longSleevesBrownQty: e.target.value })}
                                className="w-full px-2 pt-2 pb-1 border-b-2 border-slate-400 focus:border-indigo-600 focus:outline-none bg-transparent"
                                disabled={isViewOnly}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">WHITE QTY.:</label>
                              <input
                                type="text"
                                value={formData.longSleevesWhiteQty || ''}
                                onChange={(e) => setFormData({ ...formData, longSleevesWhiteQty: e.target.value })}
                                className="w-full px-2 pt-2 pb-1 border-b-2 border-slate-400 focus:border-indigo-600 focus:outline-none bg-transparent"
                                disabled={isViewOnly}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">OTHERS:</label>
                              <input
                                type="text"
                                value={formData.longSleevesOthers || ''}
                                onChange={(e) => setFormData({ ...formData, longSleevesOthers: e.target.value })}
                                className="w-full px-2 pt-2 pb-1 border-b-2 border-slate-400 focus:border-indigo-600 focus:outline-none bg-transparent"
                                disabled={isViewOnly}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">REMARKS:</label>
                            <input
                              type="text"
                              value={formData.uniformRemarks || ''}
                              onChange={(e) => setFormData({ ...formData, uniformRemarks: e.target.value })}
                              className="w-full px-2 pt-2 pb-1 border-b-2 border-slate-400 focus:border-indigo-600 focus:outline-none bg-transparent"
                              disabled={isViewOnly}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-slate-200">
                        <h4 className="text-base font-bold text-red-600 mb-4 uppercase tracking-wider">LIST OF PPES</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8">
                          {[
                            { id: 'ppeSafetyShoes', label: 'SAFETY SHOES' },
                            { id: 'ppeGripGloves', label: 'GRIP GLOVES' },
                            { id: 'ppeCottonGloves', label: 'COTTON GLOVES' },
                            { id: 'ppeHardhat', label: 'HARDHAT' },
                            { id: 'ppeFaceshield', label: 'FACESHIELD' },
                            { id: 'ppeKn95Mask', label: 'KN95 MASK' },
                            { id: 'ppeSpectacles', label: 'SPECTACLES' },
                            { id: 'ppeEarplug', label: 'EARPLUG' },
                            { id: 'ppeWeldingMask', label: 'WELDING MASK' },
                            { id: 'ppeWeldingGloves', label: 'WELDING GLOVES' },
                            { id: 'ppeWeldingApron', label: 'WELDING APRON' },
                            { id: 'ppeFullBodyHarness', label: 'FULL BODY HARNESS' },
                          ].map((item) => (
                            <label key={item.id} className="flex items-center gap-2 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={formData[item.id] || false}
                                onChange={(e) => setFormData({ ...formData, [item.id]: e.target.checked })}
                                disabled={isViewOnly}
                                className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 transition-colors"
                              />
                              <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">
                                {item.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-slate-200">
                        <h4 className="text-base font-bold text-slate-800 mb-6 uppercase tracking-wider">APPROVED BY:</h4>
                        <div className="space-y-6 max-w-md">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">HR MANAGER:</label>
                            <input
                              type="text"
                              value={formData.approvedHrManager || ''}
                              onChange={(e) => setFormData({ ...formData, approvedHrManager: e.target.value })}
                              className="w-full px-2 pt-2 pb-1 border-b-2 border-slate-400 focus:border-indigo-600 focus:outline-none bg-transparent"
                              disabled={isViewOnly}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">GENERAL MANAGER:</label>
                            <input
                              type="text"
                              value={formData.approvedGeneralManager || ''}
                              onChange={(e) => setFormData({ ...formData, approvedGeneralManager: e.target.value })}
                              className="w-full px-2 pt-2 pb-1 border-b-2 border-slate-400 focus:border-indigo-600 focus:outline-none bg-transparent"
                              disabled={isViewOnly}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">ASST. MANAGER:</label>
                            <input
                              type="text"
                              value={formData.approvedAsstManager || ''}
                              onChange={(e) => setFormData({ ...formData, approvedAsstManager: e.target.value })}
                              className="w-full px-2 pt-2 pb-1 border-b-2 border-slate-400 focus:border-indigo-600 focus:outline-none bg-transparent"
                              disabled={isViewOnly}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all"
                >
                  {isViewOnly ? 'Close' : 'Cancel'}
                </button>
                <div className="flex-1 flex justify-end gap-3">
                  {(!isViewOnly && currentStep > 1) && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all"
                    >
                      Previous
                    </button>
                  )}
                  {!isViewOnly && (
                    <button
                      type="submit"
                      className="btn-primary px-8 py-3 text-white rounded-xl font-semibold shadow-lg"
                    >
                      {currentStep === 6
                        ? (isEditing ? 'Update Employee' : 'Save Employee')
                        : 'Next'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60] card-enter">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border-2 border-slate-100">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-2">
                <Trash2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-800">Confirm Delete</h3>
                <p className="text-slate-600">
                  Are you sure you want to delete <span className="font-bold text-slate-800">"{deleteTarget?.name}"</span>?
                  This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3 w-full pt-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl font-semibold shadow-lg hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
