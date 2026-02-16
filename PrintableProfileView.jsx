import React from 'react';
import { User, Printer } from 'lucide-react';

const PrintableProfileView = ({ employee, onClose }) => {
    const handlePrint = () => {
        window.print();
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const calculateAge = (birthdate) => {
        if (!birthdate) return '';
        const today = new Date();
        const birthDate = new Date(birthdate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const CheckedBox = ({ checked }) => (
        <div className="w-3 h-3 border border-black mr-1 flex items-center justify-center bg-white">
            {(checked === true || checked === "true") ? <span className="text-[10px] font-bold">✓</span> : null}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] overflow-y-auto print:bg-white print:static print:h-auto print:overflow-visible flex flex-col items-center p-4">

            {/* Print specific styles */}
            <style>
                {`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
            background: white;
          }
          .no-print {
            display: none !important;
          }
          .print-page {
            box-shadow: none !important;
            margin: 0 !important;
            page-break-after: always;
            width: 100% !important;
            max-width: none !important;
            height: auto !important;
            min-height: 11in !important;
            padding: 0.2in 0.5in !important
          }
          /* Hide scrollbars in print */
          ::-webkit-scrollbar {
            display: none;
          }
        }
      `}
            </style>

            {/* Controls - Hidden when printing */}
            <div className="no-print fixed top-4 right-4 flex gap-2 z-50 print:hidden">
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
                >
                    <Printer size={18} />
                    Print Form
                </button>
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                    Close
                </button>
            </div>

            {/* ---------------- PAGE 1 ---------------- */}
            <div className="print-page bg-white w-[210mm] min-h-[297mm] shadow-2xl mx-auto mb-8 flex flex-col relative text-black p-12 text-xs font-sans">

                {/* Header */}
                {/* Header */}
                <div className="mb-6">
                    <div className="flex justify-between items-start mb-2 gap-4">
                        {/* Left: Address */}
                        <div className="text-[9px] text-left flex flex-col justify-center pt-2">
                            <p><span className="font-bold">Address:</span></p>
                            <p>2nd Floor GV Bldg.</p>
                            <p>Corrales Extension St. Brgy. 23</p>
                            <p>Cagayan de Oro City, Misamis Oriental 9000</p>
                            <p>Mobile no. 09550976001</p>
                            <p>Landline no. (088) 881-5587</p>
                        </div>

                        {/* Center: Logo & Company Name */}
                        <div className="flex-1 flex flex-col items-center justify-center pt-0">
                            {/* Logo */}
                            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center mb-1">
                                <img src="/logo.jpg" alt="EDP Logo" className="w-full h-full object-cover" />
                            </div>
                            {/* Text */}
                            <div className="flex flex-col items-center">
                                <h1 className="text-2xl font-bold text-[#002060] leading-none text-center whitespace-nowrap">EDP ENGINEERING SERVICES</h1>
                                <p className="text-red-600 text-xs font-bold tracking-widest mt-1 text-center w-full">Excellence - Dedication - Planning</p>
                            </div>
                        </div>

                        {/* Right: Profile Picture */}
                        <div className="flex justify-end flex-shrink-0">
                            <div className="w-[120px] h-[120px] border border-black flex items-center justify-center bg-gray-50 overflow-hidden">
                                {employee.profilePicture ? (
                                    <img src={employee.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center text-[10px] text-gray-400 font-bold">
                                        <span className="block">2x2</span>
                                        <span className="block">PICTURE</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-1 bg-gradient-to-r from-yellow-400 via-red-600 to-blue-800 mt-2"></div>
                </div>

                {/* Application Info */}
                <div className="mb-4 text-[11px] grid grid-cols-2 gap-x-8">
                    <div className="flex items-end">
                        <span className="font-bold w-32">Position applying for:</span>
                        <div className="border-b border-black flex-1 px-2">{employee.positionApplied || employee.hiredPosition || employee.position || ''}</div>
                    </div>
                    <div className="flex items-end">
                        <span className="font-bold w-32">Date of Application:</span>
                        <div className="border-b border-black flex-1 px-2">{formatDate(employee.applicationDate)}</div>
                    </div>
                </div>

                {/* EMPLOYEE INFORMATION Section Header */}
                <div className="bg-gray-800 text-white font-bold text-center py-1 mb-2 text-xs uppercase">
                    EMPLOYEE INFORMATION
                </div>

                {/* Personal Details */}
                <div className="mb-4 text-[11px]">
                    <div className="flex mb-1 items-end">
                        <span className="font-bold w-12 mr-1">Name:</span>
                        <div className="flex-1 border-b border-black flex justify-between px-2">
                            <span className="text-center flex-1">{employee.lastName || ''}</span>
                            <span className="text-center flex-1">{employee.firstName || ''}</span>
                            <span className="text-center flex-1">{employee.middleName || ''}</span>
                        </div>
                    </div>
                    <div className="flex mb-2 text-[9px] text-gray-500">
                        <span className="w-12 mr-1"></span>
                        <div className="flex-1 flex justify-between px-2">
                            <span className="text-center flex-1">Last</span>
                            <span className="text-center flex-1">First</span>
                            <span className="text-center flex-1">Middle</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-2">
                        <div className="flex items-end">
                            <span className="font-bold w-16">Cellphone:</span>
                            <div className="border-b border-black flex-1 px-2">{employee.contactNumber}</div>
                        </div>
                        <div className="flex items-end">
                            <span className="font-bold w-10">Email:</span>
                            <div className="border-b border-black flex-1 px-2">{employee.email}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-2">
                        <div className="flex items-end">
                            <span className="font-bold w-16">Birthday:</span>
                            <div className="border-b border-black flex-1 px-2">{formatDate(employee.birthday)}</div>
                        </div>
                        <div className="flex items-end">
                            <span className="font-bold w-10">Age:</span>
                            <div className="border-b border-black flex-1 px-2">{employee.age || calculateAge(employee.birthday)}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-2">
                        <div className="flex items-start">
                            <span className="font-bold w-16 mt-1">Address:</span>
                            <div className="border-b border-black flex-1 px-2 h-auto min-h-[1.5em] break-words">
                                {`${employee.street || ''} ${employee.barangay || ''} ${employee.city || ''} ${employee.province || ''}`}
                            </div>
                        </div>
                        <div className="flex items-end">
                            <span className="font-bold w-10">Status:</span>
                            <div className="border-b border-black flex-1 px-2">{employee.status}</div>
                        </div>
                    </div>

                    {/* Additional Questions */}
                    <div className="grid grid-cols-2 gap-8 mb-2">
                        <div>
                            <div className="mb-1 flex justify-between items-start">
                                <span className="flex-1 pr-2">Can you perform the position's essential functions with or without accommodations?</span>
                                <div className="space-x-2 whitespace-nowrap ml-2">
                                    <label className="inline-flex items-center"><CheckedBox checked={employee.essentialFunctions === "Yes"} /> Yes</label>
                                    <label className="inline-flex items-center"><CheckedBox checked={employee.essentialFunctions === "No" || !employee.essentialFunctions} /> No</label>
                                </div>
                            </div>
                            <div className="mb-1 flex items-center">
                                <span className="mr-2">I am seeking a permanent position:</span>
                                <label className="inline-flex items-center mr-2"><CheckedBox checked={employee.permanent === "Yes"} /> Yes</label>
                                <label className="inline-flex items-center"><CheckedBox checked={employee.permanent === "No" || !employee.permanent} /> No</label>
                            </div>
                            <div className="flex items-end">
                                <span className="mr-2">How did you hear about the position?</span>
                                <div className="border-b border-black flex-1 px-2">{employee.heardAboutPosition}</div>
                            </div>
                            <div className="mt-1">
                                <div className="flex justify-between">
                                    <span className="font-bold">Have you ever worked for this company?</span>
                                </div>
                                <div className="flex items-end mt-1">
                                    <span className="mr-2 italic">If yes when?</span>
                                    <div className="border-b border-black flex-1 px-2">{employee.workedWhen || ''}</div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="mb-1 flex justify-between">
                                <span className="font-bold">If necessary for the job, I can:</span>
                            </div>
                            <div className="flex justify-between mb-1">
                                <span>Work overtime?</span>
                                <div className="space-x-2 whitespace-nowrap">
                                    <label className="inline-flex items-center"><CheckedBox checked={employee.canWorkOvertime === "Yes"} /> Yes</label>
                                    <label className="inline-flex items-center"><CheckedBox checked={employee.canWorkOvertime === "No" || !employee.canWorkOvertime} /> No</label>
                                </div>
                            </div>
                            <div className="flex justify-between mb-1">
                                <span>Do you have a Driver's License?</span>
                                <div className="space-x-2 whitespace-nowrap">
                                    <label className="inline-flex items-center"><CheckedBox checked={employee.hasDriversLicense === "Yes"} /> Yes</label>
                                    <label className="inline-flex items-center"><CheckedBox checked={employee.hasDriversLicense === "No" || !employee.hasDriversLicense} /> No</label>
                                </div>
                            </div>
                            <div className="mb-1 pl-4">
                                <div className="flex items-end mb-1">
                                    <span className="mr-1">If so, fill out the following:</span>
                                    <span className="mr-1">Issuing state:</span>
                                    <div className="border-b border-black flex-1 px-2">{employee.licenseIssuingState}</div>
                                </div>
                                <div className="flex items-end">
                                    <span className="mr-1">Type:</span>
                                    <div className="border-b border-black flex-1 px-2"></div>
                                </div>
                            </div>

                            <div className="mb-1">
                                <p className="mb-1">Shifts (check all that apply)</p>
                                <div className="grid grid-cols-4 gap-1 text-[9px]">
                                    {['Any', 'Day', 'Night', 'Swing', 'Rotating', 'Split', 'Graveyard', 'Other'].map(shift => (
                                        <label key={shift} className="inline-flex items-center">
                                            <CheckedBox checked={(employee.shifts || []).includes(shift)} /> {shift}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* EMPLOYMENT HISTORY Section Header */}
                <div className="bg-gray-800 text-white font-bold text-center py-1 mb-2 text-xs uppercase">
                    EMPLOYMENT HISTORY
                </div>

                <div className="mb-4 text-[10px]">
                    <p className="mb-2 italic">List most recent employment first. Include summer or temporary jobs. Be sure all your experience or employers related to this job are listed here, in the summary following this section, or on an extra sheet of paper if necessary. No more than 10 years of history is recommended.</p>

                    {/* Employment History Table Rows - Repeating Block */}
                    {/* Employment History Table Rows - Repeating Block */}
                    <div className="border-2 border-black">
                        {[...Array(3)].map((_, index) => {
                            const job = (employee.employmentHistory || [])[index] || {};
                            return (
                                <div key={index} className="grid grid-cols-[1.3fr_2fr_1.2fr] border-b-2 border-black last:border-b-0 min-h-[120px]">
                                    {/* Col 1 */}
                                    <div className="border-r-2 border-black p-1 flex flex-col text-[10px]">
                                        <div className="font-bold mb-1">Employer name and address:</div>
                                        <div className="border-b border-black h-4 mb-1 truncate">{job.nameAddress1 || ''}</div>
                                        <div className="border-b border-black h-4 mb-1">{job.nameAddress2 || ''}</div>
                                        <div className="border-b border-black h-4 mb-1">{job.nameAddress3 || ''}</div>

                                        <div className="mt-auto">
                                            <div className="flex items-end mb-1">
                                                <span className="font-bold mr-1">Pay:</span>
                                                <span className="mr-1 font-bold">P</span>
                                                <div className="border-b border-black flex-1 text-center">{job.pay || ''}</div>
                                            </div>
                                            <div className="flex items-end">
                                                <span className="font-bold mr-1">Per:</span>
                                                <div className="border-b border-black flex-1 text-center">{job.per || ''}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Col 2 */}
                                    <div className="border-r-2 border-black p-1 flex flex-col text-[10px]">
                                        <div className="font-bold mb-1">Position title/duties, skills:</div>
                                        <div className="flex-1 space-y-0">
                                            <div className="border-b border-black h-4">{job.posSkills1 || ''}</div>
                                            <div className="border-b border-black h-4">{job.posSkills2 || ''}</div>
                                            <div className="border-b border-black h-4">{job.posSkills3 || ''}</div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 mt-auto pt-4">
                                            <div className="flex items-end">
                                                <span className="font-bold mr-1">Supervisor:</span>
                                                <div className="border-b border-black flex-1">{job.supervisor || ''}</div>
                                            </div>
                                            <div className="flex items-end">
                                                <span className="font-bold mr-1">Contact no.:</span>
                                                <div className="border-b border-black flex-1">{job.contactNo || ''}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Col 3 */}
                                    <div className="flex flex-col text-[10px]">
                                        <div className="flex border-b-2 border-black h-10">
                                            <div className="w-1/2 border-r-2 border-black p-1 flex flex-col">
                                                <span className="font-bold leading-none">Start date:</span>
                                                <div className="mt-auto text-center">{job.startDate || ''}</div>
                                            </div>
                                            <div className="w-1/2 p-1 flex flex-col">
                                                <span className="font-bold leading-none">End date:</span>
                                                <div className="mt-auto text-center">{job.endDate || ''}</div>
                                            </div>
                                        </div>
                                        <div className="flex-1 p-1 flex flex-col">
                                            <span className="font-bold leading-none mb-1">Reason for leaving:</span>
                                            <div className="space-y-0 flex-1">
                                                <div className="border-b border-black h-4">{job.reasonLeaving1 || ''}</div>
                                                <div className="border-b border-black h-4">{job.reasonLeaving2 || ''}</div>
                                                <div className="border-b border-black h-4">{job.reasonLeaving3 || ''}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-auto text-right text-[8px] italic">1 | Page</div>
            </div>

            {/* ---------------- PAGE 2 ---------------- */}
            <div className="print-page bg-white w-[210mm] min-h-[297mm] shadow-2xl mx-auto mb-8 flex flex-col relative text-black p-12 text-xs font-sans">

                <div className="mb-4 text-[10px]">
                    <div className="pt-1">
                        <span className="font-bold">Summarize other employment related to this job:</span>
                        <div className="border-b border-black w-full h-8 mt-1"></div>
                    </div>
                </div>

                {/* EDUCATION Section Header */}
                <div className="bg-gray-800 text-white font-bold text-center py-1 mb-2 text-xs uppercase">
                    EDUCATION
                </div>

                <div className="mb-4 text-[10px]">
                    <table className="w-full border-collapse border border-black">
                        <thead>
                            <tr>
                                <th className="border border-black p-1 w-[20%] text-left"></th>
                                <th className="border border-black p-1 w-[35%] text-left">Institution name</th>
                                <th className="border border-black p-1 w-[15%] text-left">Years completed</th>
                                <th className="border border-black p-1 w-[15%] text-left">Field of study</th>
                                <th className="border border-black p-1 w-[15%] text-left">Graduate or degree</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { label: 'High school', key: 'High School' },
                                { label: 'College/university', key: 'College/University' },
                                { label: 'Business/Technical', key: 'Business/Technical' },
                                { label: 'Additional', key: 'Additional' }
                            ].map((row, idx) => {
                                const edu = (employee.education || []).find(e => e.level === row.key) || {};
                                return (
                                    <tr key={idx}>
                                        <td className="border border-black p-1 font-bold">{row.label}</td>
                                        <td className="border border-black p-1">{edu.institution || ''}</td>
                                        <td className="border border-black p-1">{edu.years || ''}</td>
                                        <td className="border border-black p-1">{edu.field || ''}</td>
                                        <td className="border border-black p-1">{edu.degree || ''}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* CERTIFICATES & SKILLS */}
                <div className="bg-gray-800 text-white font-bold text-center py-1 mb-2 text-xs uppercase">
                    CERTIFICATES/VOCATIONAL COURSE
                </div>
                <div className="mb-2 text-[11px] flex items-center justify-between">
                    <div className="flex items-center">
                        <span className="mr-4 font-bold">Do you have NCII?</span>
                        <label className="inline-flex items-center mr-4"><CheckedBox checked={employee.hasNCII === "Yes"} /> Yes</label>
                        <label className="inline-flex items-center"><CheckedBox checked={employee.hasNCII === "No" || !employee.hasNCII} /> No</label>
                    </div>
                    <div className="flex items-end flex-1 ml-4">
                        <span className="font-bold mr-2">Duty/specialized training:</span>
                        <div className="border-b border-black flex-1 px-2">{employee.specializedTraining || ''}</div>
                    </div>
                </div>

                <div className="bg-gray-800 text-white font-bold text-center py-1 mb-2 text-xs uppercase">
                    SKILLS & QUALIFICATIONS
                </div>
                <div className="mb-4 text-[10px] space-y-2">
                    <div className="flex flex-col">
                        <span className="mb-1">Other qualifications such as special skills, abilities, or honors that should be considered:</span>
                        <div className="border-b border-black w-full min-h-[1.5em]">{employee.otherQualifications || ''}</div>
                    </div>
                    <div className="flex flex-col">
                        <span className="mb-1">Types of computers, software, and other equipment you are qualified to operate or repair:</span>
                        <div className="border-b border-black w-full min-h-[1.5em]">{employee.computerEquipment || ''}</div>
                    </div>
                    <div className="flex flex-col">
                        <span className="mb-1">Professional licenses, certifications, or registrations:</span>
                        <div className="border-b border-black w-full min-h-[1.5em]">{employee.professionalLicenses || ''}</div>
                    </div>
                    <div className="flex flex-col">
                        <span className="mb-1">Additional skills, including supervision skills, other languages, or information regarding the career/occupation you wish to bring to the employer's attention:</span>
                        <div className="border-b border-black w-full min-h-[1.5em]">{employee.additionalSkills || ''}</div>
                    </div>
                </div>

                {/* REFERENCES */}
                <div className="bg-gray-800 text-white font-bold text-center py-1 mb-2 text-xs uppercase">
                    REFERENCES
                </div>
                <div className="mb-4 text-[10px]">
                    <p className="mb-2 italic">List two personal references who are not relatives or former supervisors.</p>
                    <div className="grid grid-cols-1 gap-4">
                        {(employee.references || [{}, {}]).map((ref, idx) => (
                            <div key={idx} className="flex flex-col gap-1 border-b border-black pb-2">
                                <div className="flex justify-between">
                                    <div className="flex items-end flex-[2]">
                                        <span className="font-bold w-10">Name</span>
                                        <div className="border-b border-black flex-1 px-2">{ref.lastName ? `${ref.lastName}, ${ref.firstName}` : ''}</div>
                                    </div>
                                    <div className="flex items-end flex-[3] ml-2">
                                        <span className="font-bold w-12">Address</span>
                                        <div className="border-b border-black flex-1 px-2">{ref.address || ''}</div>
                                    </div>
                                    <div className="flex items-end flex-[1.5] ml-2">
                                        <span className="font-bold w-14">Telephone</span>
                                        <div className="border-b border-black flex-1 px-2">{ref.telephone || '-'}</div>
                                    </div>
                                    <div className="flex items-end flex-[1.5] ml-2">
                                        <span className="font-bold w-14">Occupation</span>
                                        <div className="border-b border-black flex-1 px-2">{ref.occupation || '-'}</div>
                                    </div>
                                    <div className="flex items-end flex-[1] ml-2">
                                        <span className="font-bold w-16">Years known</span>
                                        <div className="border-b border-black flex-1 px-2">{ref.yearsKnown || '-'}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CONTACT */}
                <div className="bg-gray-800 text-white font-bold text-center py-1 mb-2 text-xs uppercase">
                    CONTACT
                </div>
                <div className="mb-4 text-[11px]">
                    <p className="mb-1 italic font-bold">In case of accident or illness, please get in touch with</p>
                    <div className="flex justify-between mb-2">
                        <div className="flex items-end flex-1">
                            <span className="font-bold mr-2">Name:</span>
                            <div className="border-b border-black flex-1 px-2">{(employee.emergencyContact || {}).name || ''}</div>
                        </div>
                        <div className="flex items-end w-48 ml-4">
                            <span className="font-bold mr-2">Cellphone no:</span>
                            <div className="border-b border-black flex-1 px-2">{(employee.emergencyContact || {}).contactNumber || ''}</div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div className="flex items-end flex-1">
                            <span className="font-bold mr-2">Address:</span>
                            <div className="border-b border-black flex-1 px-2">{(employee.emergencyContact || {}).address || ''}</div>
                        </div>
                        <div className="flex items-end w-48 ml-4">
                            <span className="font-bold mr-2">Relationship:</span>
                            <div className="border-b border-black flex-1 px-2">{(employee.emergencyContact || {}).relationship || ''}</div>
                        </div>
                    </div>
                </div>

                {/* INFORMATION TO THE APPLICANT */}
                <div className="bg-gray-800 text-white font-bold text-center py-1 mb-2 text-xs uppercase">
                    INFORMATION TO THE APPLICANT
                </div>
                <div className="mb-4 text-[9px] text-justify">
                    <p className="mb-2">
                        As part of our procedure for processing your employment application, your personal and employment references may be checked. If you have misrepresented or omitted any facts on this application, and are subsequently hired, you may be discharged from your job. You may make a written request for information derived from the checking of your references.
                    </p>
                    <p className="mb-0">
                        If necessary for employment, you may be required to: supply your birth certificate or other proof of authorization to work in the EDP Engineering Services, have a physical examination and/or a drug test, or sign a conflict-of-interest agreement and abide by its terms. I understand and agree with the information shown above.
                    </p>

                    <div className="flex justify-between items-end">
                        <div className="flex-1 mr-8">
                            {/* Signature Area */}
                            <div className="border-b border-black mb-0 h-8 flex items-end justify-center relative">
                                {employee.applicantSignature ? (
                                    <img src={employee.applicantSignature} alt="Approx." className="h-20 object-contain absolute -bottom-10" />
                                ) : ''}
                            </div>
                            <p className="font-bold">Signature of Applicant</p>
                        </div>
                        <div className="w-48">
                            <div className="border-b border-black mb-0 h-8 flex items-end justify-center text-center">
                                {employee.dateSigned ? formatDate(employee.dateSigned) : ''}
                            </div>
                            <p className="font-bold text-center">Date</p>
                        </div>
                    </div>
                    <p className="mt-2 text-[8px] italic">
                        <span className="font-bold">Equal Employment Opportunity:</span> While many employers are required by federal law to have an Affirmative Action Program, all employers are required to provide equal employment opportunity and may ask your national origin, race, and sex for planning and reporting purposes only. This information is optional and failure to provide it will not affect your employment application.
                    </p>
                </div>

                <div className="mt-auto text-right text-[8px] italic">2 | Page</div>
            </div>

            {/* ---------------- PAGE 3 ---------------- */}
            <div className="print-page bg-white w-[210mm] min-h-[297mm] shadow-2xl mx-auto mb-8 flex flex-col relative text-black p-12 text-xs font-sans">

                {/* ADMIN SECTION */}
                <div className="mb-0 text-[10px]">
                    <div className="font-bold bg-yellow-300 inline-block px-1 mb-4 uppercase text-[10px] border border-black">DO NOT WRITE BELOW THIS LINE</div>
                    <div className="border-b-2 border-black w-full mb-4"></div>

                    <div className="flex items-end mb-2">
                        <span className="font-bold w-24">INTERVIEWED BY:</span>
                        <div className="border-b border-black flex-1 px-2">{employee.interviewedBy || ''}</div>
                        <span className="font-bold w-10 ml-4">DATE:</span>
                        <div className="border-b border-black w-40 px-2">{employee.interviewDate ? formatDate(employee.interviewDate) : ''}</div>
                    </div>

                    <div className="space-y-2 mb-4">
                        <div className="flex items-end">
                            <span className="font-bold w-24">REMARKS:</span>
                            <div className="border-b border-black flex-1 h-5 px-2">{employee.remarks1 || ''}</div>
                        </div>
                        <div className="border-b border-black h-5 w-full"></div>
                        <div className="border-b border-black h-5 w-full"></div>
                    </div>

                    <div className="flex items-end mb-4">
                        <span className="font-bold w-24">NEATNESS:</span>
                        <div className="border-b border-black w-48 px-2">{employee.neatness || ''}</div>
                        <span className="font-bold w-20 ml-8">ABILITY:</span>
                        <div className="border-b border-black flex-1 px-2">{employee.ability || ''}</div>
                    </div>

                    <div className="flex items-center mb-4">
                        <span className="font-bold w-24">HIRED:</span>
                        <div className="flex items-center gap-4 mr-8">
                            <label className="inline-flex items-center"><div className="w-4 h-4 border border-black mr-1 flex items-center justify-center">{employee.hired === 'Yes' ? <span className="text-[10px] font-bold">✓</span> : null}</div> YES</label>
                            <label className="inline-flex items-center"><div className="w-4 h-4 border border-black mr-1 flex items-center justify-center">{employee.hired === 'No' ? <span className="text-[10px] font-bold">✓</span> : null}</div> NO</label>
                        </div>

                        <span className="font-bold mr-2">POSITION:</span>
                        <div className="border-b border-black w-48 px-2 mr-4">{employee.hiredPosition || ''}</div>
                        <span className="font-bold mr-2">DEPT.:</span>
                        <div className="border-b border-black flex-1 px-2">{employee.hiredDept || ''}</div>
                    </div>

                    <div className="flex items-end mb-4">
                        <span className="font-bold w-24">SALARY/WAGE</span>
                        <div className="border-b border-black w-40 px-2 mr-8">{employee.salaryWage || ''}</div>
                        <span className="font-bold mr-2">DATE OF REPORTING TO WORK:</span>
                        <div className="border-b border-black flex-1 px-2">{employee.reportingDate ? formatDate(employee.reportingDate) : ''}</div>
                    </div>

                    {/* REQUIREMENTS */}
                    {/* REQUIREMENTS - General Docs */}
                    <div className="mb-4">
                        <div className="font-bold text-red-600 mb-2 text-[10px]">REQUIREMENTS</div>
                        <div className="flex gap-8 mb-4">
                            {/* Left: Numbers */}
                            <div className="flex-1 space-y-2 text-[9px]">
                                <div className="flex items-end">
                                    <span className="font-bold w-24">SSS NO.:</span>
                                    <div className="border-b border-black flex-1 px-2">{employee.sssNo || ''}</div>
                                </div>
                                <div className="flex items-end">
                                    <span className="font-bold w-24">PHILHEALTH no.:</span>
                                    <div className="border-b border-black flex-1 px-2">{employee.philhealthNo || ''}</div>
                                </div>
                                <div className="flex items-end">
                                    <span className="font-bold w-24">PAG-IBIG NO.:</span>
                                    <div className="border-b border-black flex-1 px-2">{employee.pagibigNo || ''}</div>
                                </div>
                                <div className="flex items-end">
                                    <span className="font-bold w-24">TIN NO.:</span>
                                    <div className="border-b border-black flex-1 px-2">{employee.tinNo || ''}</div>
                                </div>
                            </div>
                            {/* Right: Certs */}
                            <div className="flex-1 space-y-1 text-[9px]">
                                <div className="flex items-center py-1">
                                    <div className="w-5 h-5 border border-black mr-2 flex items-center justify-center">{employee.hasBirthCertificate ? <span className="text-sm font-bold">✓</span> : null}</div>
                                    <span className="font-bold uppercase">BIRTH CERTIFICATE</span>
                                </div>
                                <div className="flex items-center py-1">
                                    <div className="w-5 h-5 border border-black mr-2 flex items-center justify-center">{employee.hasMarriageContract ? <span className="text-sm font-bold">✓</span> : null}</div>
                                    <span className="font-bold uppercase">MARRIAGE CONTRACT IF APPLICABLE</span>
                                </div>
                                <div className="flex items-center py-1">
                                    <div className="w-5 h-5 border border-black mr-2 flex items-center justify-center">{employee.hasNciiCertificate ? <span className="text-sm font-bold">✓</span> : null}</div>
                                    <span className="font-bold uppercase">NCII CERTIFICATES EXPIRED OR NOT EXPIRED</span>
                                </div>
                            </div>
                        </div>

                        {/* FOR NPI BIOMETRICS & EMPLOYMENT CONTRACT */}
                        <div className="font-bold text-red-600 mb-2 text-[10px]">FOR NPI BIOMETRICS</div>
                        <div className="flex gap-8">
                            {/* Left Side: Biometrics List */}
                            <div className="flex-[1.2] space-y-2 text-[9px]">
                                <div className="flex items-center">
                                    <div className="w-5 h-5 border border-black mr-2 flex items-center justify-center">{employee.hasNbi ? <span className="text-sm font-bold">✓</span> : null}</div>
                                    <span className="font-bold w-24 uppercase">NBI</span>
                                    <span className="font-bold mr-1 w-20">EXPIRY DATE:</span>
                                    <div className="border-b border-black flex-1 text-[9px]">{employee.nbiExpiryDate ? formatDate(employee.nbiExpiryDate) : ''}</div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-5 h-5 border border-black mr-2 flex items-center justify-center">{employee.hasDrugTest ? <span className="text-sm font-bold">✓</span> : null}</div>
                                    <span className="font-bold w-24 uppercase">DRUG TEST</span>
                                    <span className="font-bold mr-1 w-20">EXPIRY DATE:</span>
                                    <div className="border-b border-black flex-1 text-[9px]">{employee.drugTestExpiryDate ? formatDate(employee.drugTestExpiryDate) : ''}</div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-5 h-5 border border-black mr-2 flex items-center justify-center">{employee.hasHealthCard ? <span className="text-sm font-bold">✓</span> : null}</div>
                                    <span className="font-bold w-24 uppercase">HEALTH CARD</span>
                                    <span className="font-bold mr-1 w-20">EXPIRY DATE:</span>
                                    <div className="border-b border-black flex-1 text-[9px]">{employee.healthCardExpiryDate ? formatDate(employee.healthCardExpiryDate) : ''}</div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-5 h-5 border border-black mr-2 flex items-center justify-center">{employee.hasBarangayClearance ? <span className="text-sm font-bold">✓</span> : null}</div>
                                    <span className="font-bold w-36 uppercase">BRG BRGY. CLEARANCE</span>
                                    <span className="font-bold mr-1">EXPIRY DATE:</span>
                                    <div className="border-b border-black flex-1 text-[9px]">{employee.barangayClearanceExpiryDate ? formatDate(employee.barangayClearanceExpiryDate) : ''}</div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-5 h-5 border border-black mr-2 flex items-center justify-center">{employee.hasQuitclaim ? <span className="text-sm font-bold">✓</span> : null}</div>
                                    <span className="font-bold uppercase">QUITCLAIM IF APPLICABLE</span>
                                </div>
                            </div>

                            {/* Right Side: Employment Contract */}
                            <div className="flex-1 space-y-2 text-[9px]">
                                <div className="flex items-center h-6"> {/* Align with checkbox row */}
                                    <div className="w-5 h-5 border border-black mr-2 flex items-center justify-center">{employee.hasEmploymentContract ? <span className="text-sm font-bold">✓</span> : null}</div>
                                    <span className="font-bold uppercase">EMPLOYMENT CONTRACT</span>
                                </div>
                                <div className="flex items-end pl-0">
                                    <span className="font-bold w-20">EXPIRY DATE:</span>
                                    <div className="border-b border-black flex-1 text-[9px]">{employee.employmentContractExpiryDate ? formatDate(employee.employmentContractExpiryDate) : ''}</div>
                                </div>
                                <div className="flex items-end pl-0">
                                    <span className="font-bold w-20">STATUS:</span>
                                    <div className="border-b border-black flex-1 text-[9px]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* UNIFORM */}
                    <div className="mt-2 text-[9px]">
                        <div className="font-bold text-red-600 mb-2 text-[10px]">UNIFORM</div>

                        {/* First Row: Long Pants, PVC ID, Sling */}
                        <div className="flex items-end justify-between mb-2">
                            <div className="flex items-end">
                                <div className="w-5 h-5 border border-black mr-2 flex items-center justify-center">{employee.hasLongPants ? <span className="text-sm font-bold">✓</span> : null}</div>
                                <span className="font-bold mr-2">LONG PANTS</span>
                                <span className="font-bold mr-2">QTY:</span>
                                <div className="border-b border-black w-20 text-center">{employee.longPantsQty || ''}</div>
                            </div>

                            <div className="flex items-center">
                                <div className="w-5 h-5 border border-black mr-2 flex items-center justify-center">{employee.hasPvcId ? <span className="text-sm font-bold">✓</span> : null}</div>
                                <span className="font-bold">PVC ID</span>
                            </div>

                            <div className="flex items-center">
                                <div className="w-5 h-5 border border-black mr-2 flex items-center justify-center">{employee.hasSling ? <span className="text-sm font-bold">✓</span> : null}</div>
                                <span className="font-bold">SLING</span>
                            </div>
                        </div>

                        {/* Second Row: Long Sleeves and variants */}
                        <div className="flex items-end mb-2 flex-wrap">
                            <div className="w-5 h-5 border border-black mr-2 flex items-center justify-center">{employee.hasLongSleeves ? <span className="text-sm font-bold">✓</span> : null}</div>
                            <span className="font-bold mr-2">LONG SLEEVES</span>

                            <span className="font-bold mr-1">BROWN QTY.:</span>
                            <div className="border-b border-black w-14 text-center mr-2">{employee.longSleevesBrownQty || ''}</div>

                            <span className="font-bold mr-1">BLUE QTY.:</span>
                            <div className="border-b border-black w-14 text-center mr-2"></div>

                            <span className="font-bold mr-1">WHITE QTY.:</span>
                            <div className="border-b border-black w-14 text-center mr-2">{employee.longSleevesWhiteQty || ''}</div>

                            <span className="font-bold mr-1">OTHERS:</span>
                            <div className="border-b border-black flex-1 text-center">{employee.longSleevesOthers || ''}</div>
                        </div>

                        {/* Remarks */}
                        <div className="flex items-end">
                            <span className="font-bold mr-2">REMARKS:</span>
                            <div className="border-b border-black flex-1">{employee.uniformRemarks || ''}</div>
                        </div>
                    </div>

                    {/* PPEs */}
                    <div className="mt-4">
                        <div className="font-bold text-slate-800 mb-2 text-[10px]">LIST OF PPES</div>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {[
                                { label: 'SAFETY SHOES', key: 'ppeSafetyShoes', image: '/assets/safety shoes.jpg' },
                                { label: 'GRIP GLOVES', key: 'ppeGripGloves', image: '/assets/grip gloves.jpg' },
                                { label: 'COTTON GLOVES', key: 'ppeCottonGloves', image: '/assets/cotton gloves.jpg' },
                                { label: 'HARDHAT', key: 'ppeHardhat', image: '/assets/hard hat.jpg' },
                                { label: 'FACESHIELD', key: 'ppeFaceshield', image: '/assets/face shield.jpg' },
                                { label: 'KN95 MASK', key: 'ppeKn95Mask', image: '/assets/kn95 mask.jpg' },
                                { label: 'SPECTACLES', key: 'ppeSpectacles', image: '/assets/spectacles.jpg' },
                                { label: 'EARPLUG', key: 'ppeEarplug', image: '/assets/earplug.jpg' },
                                { label: 'WELDING MASK', key: 'ppeWeldingMask', image: '/assets/welding mask.jpg' },
                                { label: 'WELDING GLOVES', key: 'ppeWeldingGloves', image: '/assets/welding gloves.jpg' },
                                { label: 'WELDING APRON', key: 'ppeWeldingApron', image: '/assets/welding apron.jpg' },
                                { label: 'FULL BODY HARNESS', key: 'ppeFullBodyHarness', image: '/assets/full body harness.jpg' },
                            ].map((ppe, i) => (
                                <div key={i} className="flex flex-col items-center flex-shrink-0">
                                    <div className={`w-12 h-12 border border-black mb-1 flex items-center justify-center overflow-hidden`}>
                                        <img src={ppe.image} alt={ppe.label} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="w-4 h-4 border border-black flex items-center justify-center mb-1">
                                        {employee[ppe.key] ? '✓' : ''}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* APPROVAL SECTION */}
                    <div className="mt-auto pt-4 print-break-inside-avoid">
                        <table className="w-full border-collapse border border-black text-[9px]">
                            <tbody>
                                <tr>
                                    <td className="border border-black p-1 bg-yellow-300 w-[20%]">
                                        <span className="font-bold border-b border-black">APPROVED BY:</span>
                                    </td>
                                    <td className="border border-black p-1 w-[30%]"></td>
                                    <td className="border border-black p-1 w-[20%]"></td>
                                    <td className="border border-black p-1 w-[30%]"></td>
                                </tr>

                                <tr className="h-8">
                                    <td className="border border-black p-1 font-bold text-center">HR MANAGER:</td>
                                    <td className="border border-black p-1">
                                        <div className="border-b border-black w-full h-full min-h-[1.5em] text-center">{employee.approvedHrManager || ''}</div>
                                    </td>
                                    <td className="border border-black p-1 font-bold text-center">ASST. MANAGER:</td>
                                    <td className="border border-black p-1">
                                        <div className="border-b border-black w-full h-full min-h-[1.5em] text-center">{employee.approvedAsstManager || ''}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black p-1"></td>
                                    <td className="border border-black p-1 text-center font-bold">MS. YASMEN M. DATU-IMAM</td>
                                    <td className="border border-black p-1"></td>
                                    <td className="border border-black p-1 text-center font-bold">MR. SYMON LOIS M. MAÑIGO</td>
                                </tr>
                                <tr className="h-8">
                                    <td className="border border-black p-1 font-bold text-center">GENERAL MANAGER:</td>
                                    <td className="border border-black p-1">
                                        <div className="border-b border-black w-full h-full min-h-[1.5em] text-center">{employee.approvedGeneralManager || ''}</div>
                                    </td>
                                    <td className="border border-black p-1"></td>
                                    <td className="border border-black p-1"></td>
                                </tr>
                                <tr>
                                    <td className="border border-black p-1"></td>
                                    <td className="border border-black p-1 text-center font-bold">MR. ERNESTO D. PANLASIGUE</td>
                                    <td className="border border-black p-1"></td>
                                    <td className="border border-black p-1"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-auto text-right text-[8px] italic">3 | Page</div>

                    {/* Bottom Controls */}
                    <div className="mt-8 flex justify-center no-print print:hidden pb-8">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-semibold"
                        >
                            Close View
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrintableProfileView;
