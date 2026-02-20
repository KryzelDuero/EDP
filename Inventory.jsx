import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import {
    Search, Filter, Plus, ChevronLeft, ChevronRight, ClipboardList,
    CheckCircle2, AlertCircle, Clock, Wrench, User,
    MapPin, Tag, Info, History, Package,
    ArrowUpRight, ArrowDownRight, Printer, Download, Eye,
    Check, Pencil, Trash2, X, Upload, BarChart3, QrCode, Activity,
    FileText, Settings, ShieldCheck, Laptop, Monitor, MousePointer2,
    Camera, Calendar, Hash, ChevronDown
} from 'lucide-react';
import { supabase } from './supabaseClient';

const Peso = ({ className }) => (
    <span className={`${className} inline-flex items-center justify-center font-black leading-none text-[1.1em]`}>₱</span>
);

const Inventory = ({ title = "Enterprise Unit Control", tableName = "inventory" }) => {
    const isConsumables = tableName === 'consumables_inventory';
    const [assets, setAssets] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [conditionFilter, setConditionFilter] = useState('All');
    const [locationFilter, setLocationFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [activeTab, setActiveTab] = useState('overview');
    const fileInputRef = useRef(null);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [newAssetFormData, setNewAssetFormData] = useState({});
    const [checkoutFormData, setCheckoutFormData] = useState({
        checkOutDate: new Date().toISOString().split('T')[0],
        returnDue: '',
        checkedOutBy: '',
        jobsite: '',
        name: '',
        email: '',
        phone: '',
        quantity: ''
    });
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [showJobsiteDropdown, setShowJobsiteDropdown] = useState(false);
    const [showFullHistory, setShowFullHistory] = useState(false);
    const detailsRef = useRef(null);
    const jobsiteDropdownRef = useRef(null);

    // Unified mapping function for both inventory/consumables since they share the same schema
    const mapFromDB = (item) => ({
        id: item.id,
        name: item.name,
        model: item.model || '',
        manufacturer: item.manufacturer || '',
        serial: item.serial || '',
        barcode: item.barcode || '',
        status: item.status || 'Available',
        location: item.location || '',
        condition: item.condition || 'Excellent',
        type: item.type || '',
        lastAdjust: item.last_adjust || null,
        notes: item.notes || '',
        checkedOutDate: item.checked_out_date || null,
        returnDue: item.return_due || null,
        originalCost: item.original_cost,
        currentValue: item.current_value,
        imageUrl: item.image_url || '',
        activity: Array.isArray(item.activity) ? item.activity : [],
        checkedOutTo: item.checked_out_to || null,
        quantity: item.quantity || 0,
        description: item.description || ''
    });

    const mapToDB = (item) => {
        const payload = {
            name: item.name,
            model: item.model || null,
            manufacturer: item.manufacturer || null,
            serial: item.serial || null,
            barcode: item.barcode || null,
            status: item.status || 'Available',
            location: item.location || null,
            condition: item.condition || null,
            type: item.type || null,
            last_adjust: item.lastAdjust || null,
            notes: item.notes || null,
            checked_out_date: item.checkedOutDate || null,
            return_due: item.returnDue || null,
            original_cost: item.originalCost === '' ? null : item.originalCost,
            current_value: item.currentValue === '' ? null : item.currentValue,
            image_url: item.imageUrl || null,
            activity: Array.isArray(item.activity) ? item.activity : [],
            checked_out_to: item.checkedOutTo || null,
            quantity: item.quantity || null,
            description: item.description || null
        };

        if (item.id) {
            payload.id = item.id;
        }

        return payload;
    };

    const fetchAssets = async () => {
        try {
            setLoading(true);
            setFetchError(null);

            // Log for debugging
            console.log(`Fetching from table: ${tableName}`);

            const { data, error } = await supabase
                .from(tableName)
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setAssets((data || []).map(mapFromDB));
        } catch (error) {
            console.error('Error fetching assets:', error);
            setFetchError(error?.message || JSON.stringify(error) || 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchAssets();
        setSelectedAsset(null); // Reset selection when switching tables
        setSearchQuery(''); // Optional: clear search query
        setCurrentPage(1); // Reset to first page
    }, [tableName]);

    const stats = {
        total: assets?.length || 0,
        available: assets?.filter(a => a?.status === 'Available' && !(a?.quantity === 0 && tableName === 'consumables_inventory')).length || 0,
        checkedOut: assets?.filter(a => a?.status === 'Checked Out' || a?.status === 'Out of Stock' || (a?.quantity === 0 && tableName === 'consumables_inventory')).length || 0,
        maintenance: assets?.filter(a => a?.status === 'Broken' || a?.status === 'In Repair').length || 0
    };

    const getStatusColor = (status, asset) => {
        const effectiveStatus = (asset?.quantity === 0 && isConsumables) ? 'Out of Stock' : status;
        switch (effectiveStatus) {
            case 'Available': return 'text-emerald-600';
            case 'Checked Out': return 'text-blue-600';
            case 'Out of Stock': return 'text-rose-600';
            case 'Broken': return 'text-red-600';
            case 'In Repair': return 'text-orange-600';
            default: return 'text-slate-600';
        }
    };

    const handleCheckoutSubmit = async (e) => {
        e.preventDefault();

        // Calculate new quantity if applicable
        let newQuantity = selectedAsset.quantity;
        let newStatus = 'Checked Out';
        const checkoutQty = parseInt(checkoutFormData.quantity);

        if (selectedAsset.quantity && !isNaN(checkoutQty) && checkoutQty > 0) {
            newQuantity = Math.max(0, selectedAsset.quantity - checkoutQty);
            // If items remain, keep status as Available (or whatever it was before), otherwise Out of Stock
            if (newQuantity > 0) {
                newStatus = selectedAsset.status; // Keep existing status (likely 'Available')
            } else {
                newStatus = isConsumables ? 'Available' : 'Out of Stock';
            }
        }

        const updatedAssetData = {
            ...selectedAsset,
            status: newStatus,
            quantity: newQuantity,
            checkedOutDate: checkoutFormData.checkOutDate,
            returnDue: checkoutFormData.returnDue,
            // Only set checkedOutTo if fully checked out or if we want to track the last person
            // For now, let's keep it as is, but be aware it overwrites previous "checked out to" if multiple people take from a pile
            checkedOutTo: {
                name: checkoutFormData.name,
                email: checkoutFormData.email,
                phone: checkoutFormData.phone,
                jobsite: checkoutFormData.jobsite
            },
            activity: [
                {
                    date: new Date().toISOString().split('T')[0],
                    user: checkoutFormData.checkedOutBy || 'Admin',
                    action: (() => {
                        const qtyPart = checkoutFormData.quantity ? `(${checkoutFormData.quantity}) ` : '';
                        const namePart = checkoutFormData.name ? `to ${checkoutFormData.name}` : '';
                        const jobPart = checkoutFormData.jobsite ? `at ${checkoutFormData.jobsite}` : '';
                        return [`Checked out`, qtyPart, namePart, jobPart].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim() || 'Checked out';
                    })(),
                    status: newStatus
                },
                ...(selectedAsset?.activity || [])
            ]
        };

        try {
            const { error } = await supabase
                .from(tableName)
                .update(mapToDB(updatedAssetData))
                .eq('id', selectedAsset.id);

            if (error) throw error;

            setAssets(prev => prev.map(a => a.id === selectedAsset.id ? updatedAssetData : a));
            setSelectedAsset(updatedAssetData);
            setShowCheckoutModal(false);
            setCheckoutFormData({
                checkOutDate: new Date().toISOString().split('T')[0],
                returnDue: '',
                checkedOutBy: '',
                jobsite: '',
                name: '',
                email: '',
                phone: '',
                quantity: ''
            });
        } catch (error) {
            console.error('Error checking out asset:', error);
            alert(`Failed to check out unit: ${error.message || 'Unknown error'}`);
        }
    };

    const handleEditClick = () => {
        if (!selectedAsset) return;
        setEditFormData({ ...selectedAsset });
        setIsEditing(true);
    };

    const handleEditSubmit = async () => {
        const newActivity = {
            date: new Date().toISOString().split('T')[0],
            user: 'Admin',
            action: 'Unit Details Updated',
            status: editFormData.condition || selectedAsset?.condition,
            lastAdjust: new Date().toISOString().split('T')[0]
        };

        const updatedAssetData = {
            ...selectedAsset,
            ...editFormData,
            originalCost: editFormData.originalCost === '' ? 0 : Number(editFormData.originalCost),
            currentValue: editFormData.currentValue === '' ? 0 : Number(editFormData.currentValue),
            activity: [newActivity, ...(selectedAsset?.activity || [])]
        };

        try {
            const { error } = await supabase
                .from(tableName)
                .update(mapToDB(updatedAssetData))
                .eq('id', selectedAsset.id);

            if (error) throw error;

            setAssets(prev => prev.map(a => a.id === selectedAsset.id ? updatedAssetData : a));
            setSelectedAsset(updatedAssetData);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating asset:', error);
            alert(`Failed to update unit: ${error.message || 'Unknown error'}`);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditFormData({});
    };

    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditFormData(prev => ({
                    ...prev,
                    imageUrl: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleReturnSubmit = async () => {
        if (!selectedAsset) return;

        const updatedAssetData = {
            ...selectedAsset,
            status: 'Available',
            checkedOutTo: null,
            checkedOutDate: null,
            returnDue: null,
            activity: [
                {
                    date: new Date().toISOString().split('T')[0],
                    user: 'Admin',
                    action: 'Unit Returned to Inventory',
                    status: 'Available'
                },
                ...(selectedAsset?.activity || [])
            ]
        };

        try {
            const { error } = await supabase
                .from(tableName)
                .update(mapToDB(updatedAssetData))
                .eq('id', selectedAsset.id);

            if (error) throw error;

            setAssets(prev => prev.map(a => a.id === selectedAsset.id ? updatedAssetData : a));
            setSelectedAsset(updatedAssetData);
        } catch (error) {
            console.error('Error returning asset:', error);
            alert(`Failed to return unit: ${error.message || 'Unknown error'}`);
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedAsset) return;
        try {
            const { error } = await supabase
                .from(tableName)
                .delete()
                .eq('id', selectedAsset.id);

            if (error) throw error;

            setAssets(prev => prev.filter(a => a.id !== selectedAsset.id));
            setSelectedAsset(null);
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting asset:', error);
            alert(`Failed to delete unit: ${error.message || 'Unknown error'}`);
        }
    };

    const handleAddClick = () => {
        setNewAssetFormData({
            name: '',
            type: 'Supplies',
            manufacturer: '',
            model: '',
            serial: '',
            description: '',
            barcode: '',
            location: '1st Floor',
            condition: 'Excellent',
            quantity: '',
            status: 'Available',
            notes: '',
            originalCost: '',
            currentValue: '',
            imageUrl: ''
        });
        setShowAddModal(true);
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        const newAssetData = {
            ...newAssetFormData,
            id: (Math.floor(Math.random() * 9000000) + 1000000).toString(),
            originalCost: newAssetFormData.originalCost === '' ? 0 : Number(newAssetFormData.originalCost),
            currentValue: newAssetFormData.currentValue === '' ? 0 : Number(newAssetFormData.currentValue),
            activity: [
                {
                    date: new Date().toISOString().split('T')[0],
                    user: 'Admin',
                    action: 'Unit Created',
                    status: 'NEW'
                }
            ],
            checkedOutTo: null,
            checkedOutDate: null,
            returnDue: null,
            lastAdjust: null
        };

        try {
            const { data, error } = await supabase
                .from(tableName)
                .insert([mapToDB(newAssetData)])
                .select();

            if (error) throw error;

            if (data && data.length > 0) {
                const createdAsset = mapFromDB(data[0]);
                setAssets(prev => [createdAsset, ...prev]);
                setShowAddModal(false);
            }
        } catch (error) {
            console.error('Error adding asset:', error);
            alert(`Failed to add unit: ${error.message || 'Unknown error'}`);
        }
    };

    const handleAddImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewAssetFormData(prev => ({
                    ...prev,
                    imageUrl: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const filteredAssets = (assets || []).filter(asset => {
        const matchesSearch = (asset?.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (asset?.id || '').includes(searchQuery);
        const matchesStatus = statusFilter === 'All' || asset?.status === statusFilter;
        const matchesCondition = conditionFilter === 'All' || asset?.condition === conditionFilter;
        const matchesLocation = locationFilter === 'All' || asset?.location === locationFilter;
        return matchesSearch && matchesStatus && matchesCondition && matchesLocation;
    });

    const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
    const paginatedAssets = filteredAssets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Close dropdown on click outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (jobsiteDropdownRef.current && !jobsiteDropdownRef.current.contains(event.target)) {
                setShowJobsiteDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Reset to page 1 when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter, conditionFilter, locationFilter]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                    <Package className="w-6 h-6 text-indigo-600 absolute inset-0 m-auto animate-pulse" />
                </div>
                <div className="text-center">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Synchronizing Inventory</h3>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">Connecting to Secure Database...</p>
                </div>
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 p-8">
                <div className="w-16 h-16 bg-rose-50 border-2 border-rose-100 rounded-3xl flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-rose-600" />
                </div>
                <div className="text-center max-w-lg">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">Database Error</h3>
                    <p className="text-xs font-mono text-rose-600 bg-rose-50 border border-rose-100 rounded-xl p-4 text-left break-all">{fetchError}</p>
                    <button
                        onClick={fetchAssets}
                        className="mt-4 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <>
                <div className="space-y-6 animate-in fade-in duration-700">
                    {/* Header section with Stats */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-slate-100 ring-1 ring-slate-900/5">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
                                    <ClipboardList className="w-6 h-6 text-white" />
                                </div>
                                <h1 className="text-3xl font-black text-slate-800 tracking-tight">{title}</h1>
                            </div>
                            <p className="text-slate-500 mt-2 font-medium flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                System Active: Tracking {assets.length} institutional units
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleAddClick}
                                className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all hover:-translate-y-1 active:scale-95">
                                <Plus className="w-5 h-5 font-black" />
                                New Unit
                            </button>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Inventory', value: stats.total, icon: Package, color: 'from-indigo-500 to-violet-600', iconColor: 'text-indigo-600 bg-indigo-50' },
                            { label: 'Units Ready', value: stats.available, icon: CheckCircle2, color: 'from-emerald-500 to-teal-600', iconColor: 'text-emerald-600 bg-emerald-50' },
                            { label: 'Check out Units', value: stats.checkedOut, icon: Clock, color: 'from-blue-500 to-indigo-600', iconColor: 'text-blue-600 bg-blue-50' },
                            { label: 'Service Units', value: stats.maintenance, icon: Wrench, color: 'from-rose-500 to-red-600', iconColor: 'text-red-600 bg-red-50' }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-xl hover:shadow-indigo-500/5 transition-all cursor-default group border-b-4 border-b-transparent hover:border-b-indigo-500">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.iconColor} group-hover:scale-110 transition-transform shadow-sm`}>
                                    <stat.icon className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                                    <p className="text-3xl font-black text-slate-800 tabular-nums">{stat.value.toString().padStart(2, '0')}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                        {/* Main List Column */}
                        <div className="xl:col-span-12">
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden ring-1 ring-slate-900/5">
                                <div className="p-4 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row gap-4 items-center justify-between">
                                    <div className="flex flex-col md:flex-row items-center gap-4 w-full">
                                        <div className="relative w-full md:w-72">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
                                                placeholder="Search Unit"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                                            {/* Status Filter */}
                                            <div className="relative group min-w-[140px]">
                                                <select
                                                    value={statusFilter}
                                                    onChange={(e) => setStatusFilter(e.target.value)}
                                                    className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer shadow-sm transition-all pr-8"
                                                >
                                                    <option value="All">All Status</option>
                                                    <option value="Available">Available</option>
                                                    <option value="Checked Out">Checked Out</option>
                                                    <option value="Out of Stock">Out of Stock</option>
                                                    <option value="Broken">Broken</option>
                                                    <option value="In Repair">In Repair</option>
                                                </select>
                                                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none group-hover:text-indigo-500 transition-colors" />
                                            </div>

                                            {/* Condition Filter */}
                                            <div className="relative group min-w-[140px]">
                                                <select
                                                    value={conditionFilter}
                                                    onChange={(e) => setConditionFilter(e.target.value)}
                                                    className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer shadow-sm transition-all pr-8"
                                                >
                                                    <option value="All">All Conditions</option>
                                                    <option value="Excellent">Excellent</option>
                                                    <option value="Good">Good</option>
                                                    <option value="New">New</option>
                                                    <option value="Critical">Critical</option>
                                                    <option value="Broken">Broken</option>
                                                </select>
                                                <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none group-hover:text-indigo-500 transition-colors" />
                                            </div>

                                            {/* Location Filter */}
                                            <div className="relative group min-w-[140px]">
                                                <select
                                                    value={locationFilter}
                                                    onChange={(e) => setLocationFilter(e.target.value)}
                                                    className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer shadow-sm transition-all pr-8"
                                                >
                                                    <option value="All">All Locations</option>
                                                    <option value="NPI Plant">NPI Plant</option>
                                                    <option value="Del Monte Plant">Del Monte Plant</option>
                                                    <option value="Balulang Shop">Balulang Shop</option>
                                                    <option value="EDP Conference Office">EDP Conference Office</option>
                                                    <option value="EDP Admin Office">EDP Admin Office</option>
                                                </select>
                                                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none group-hover:text-indigo-500 transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/50 text-slate-900 text-sm font-black uppercase tracking-[0.2em] border-b border-slate-100">
                                                <th className="px-6 py-5">Item #</th>
                                                <th className="px-6 py-5">Unit Name</th>
                                                <th className="px-6 py-5">Status</th>
                                                <th className="px-6 py-5">Location</th>
                                                <th className="px-6 py-5">Condition</th>
                                                <th className="px-6 py-5">Return Date</th>
                                                <th className="px-6 py-5">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {paginatedAssets.map(asset => (
                                                <tr
                                                    key={asset.id}
                                                    className={`hover:bg-indigo-50/40 transition-all cursor-pointer group relative ${selectedAsset?.id === asset.id ? 'bg-indigo-50/60' : ''}`}
                                                    onClick={() => setSelectedAsset(asset)}
                                                >
                                                    <td className="px-6 py-5">
                                                        <span className="font-mono text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md w-fit">{asset.id}</span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <p className="font-bold text-sm text-slate-800 group-hover:text-indigo-600 transition-colors">{asset.name}</p>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex flex-col gap-1.5">
                                                            {(() => {
                                                                const effectiveStatus = (asset.quantity === 0 && tableName === 'consumables_inventory') ? 'Out of Stock' : asset.status;
                                                                return (
                                                                    <span className={`text-xs font-black uppercase tracking-wider w-fit flex items-center gap-1.5 ${getStatusColor(effectiveStatus, asset)}`}>
                                                                        <div className={`w-1.5 h-1.5 rounded-full ${effectiveStatus === 'Available' ? 'bg-emerald-500' : 'bg-current'}`} />
                                                                        {effectiveStatus}
                                                                    </span>
                                                                );
                                                            })()}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-2 text-sm text-slate-600 font-bold w-fit">
                                                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                                            {asset.location}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex flex-col gap-1">
                                                            <span className={`text-xs font-black uppercase tracking-widest ${asset.condition === 'Excellent' ? 'text-emerald-600' :
                                                                asset.condition === 'Good' ? 'text-blue-600' : 'text-rose-600'
                                                                }`}>
                                                                {asset.condition}
                                                            </span>
                                                            <div className="w-20 h-1 bg-slate-100 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full rounded-full ${asset.condition === 'Excellent' ? 'bg-emerald-500 w-full' :
                                                                        asset.condition === 'Good' ? 'bg-blue-500 w-3/4' : 'bg-rose-500 w-1/4'
                                                                        }`}
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="text-sm font-bold text-slate-600 tabular-nums">
                                                            {asset.returnDue || '-'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedAsset(asset);
                                                                    setActiveTab('overview');
                                                                    setTimeout(() => {
                                                                        detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                                    }, 100);
                                                                }}
                                                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-200"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination Controls */}
                                {filteredAssets.length > 0 && (
                                    <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            Showing <span className="text-indigo-600">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-indigo-600">{Math.min(currentPage * itemsPerPage, filteredAssets.length)}</span> of <span className="text-indigo-600">{filteredAssets.length}</span> units
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                disabled={currentPage === 1}
                                                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-all shadow-sm"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </button>
                                            <div className="flex items-center gap-1">
                                                {[...Array(totalPages)].map((_, i) => (
                                                    <button
                                                        key={i + 1}
                                                        onClick={() => setCurrentPage(i + 1)}
                                                        className={`w-8 h-8 rounded-xl text-xs font-black transition-all ${currentPage === i + 1
                                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                                            : 'bg-white text-slate-400 border border-slate-200 hover:border-indigo-200 hover:text-indigo-600'
                                                            }`}
                                                    >
                                                        {i + 1}
                                                    </button>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                                disabled={currentPage === totalPages}
                                                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-all shadow-sm"
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Unified Asset Intelligence Panel */}
                    {selectedAsset && (
                        <div
                            ref={detailsRef}
                            className="xl:col-span-12 bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-8 duration-700 ring-1 ring-slate-900/5 mt-4"
                        >
                            {/* Panel Header */}
                            <div className="p-8 border-b border-slate-100 bg-slate-50/30">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center border-2 shadow-inner transition-all duration-500 bg-white border-slate-100`}>
                                            <Package className="w-10 h-10 text-indigo-600 transition-transform hover:scale-110" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-3 mb-1">
                                                <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-tight">{selectedAsset.name}</h2>
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ring-4 ring-white shadow-sm flex-shrink-0 ${getStatusColor(selectedAsset.status)}`}>
                                                    {selectedAsset.status}
                                                </span>
                                            </div>
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                                Unit Serial: <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md font-mono">{selectedAsset.serial}</span>
                                                <span className="text-slate-200">|</span>
                                                Model: <span className="text-slate-600">{selectedAsset.model}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        {isEditing ? (
                                            <>
                                                <button
                                                    onClick={handleEditSubmit}
                                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
                                                    <Check className="w-4 h-4" /> Save Changes
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all border border-slate-200">
                                                    <X className="w-4 h-4" /> Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={handleEditClick}
                                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-all border border-indigo-100">
                                                    <Pencil className="w-4 h-4" /> Edit Unit
                                                </button>
                                                <button
                                                    onClick={handleDeleteClick}
                                                    className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-all border border-rose-100">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Custom Tab Navigation */}
                                <div className="flex items-center gap-6 mt-10">
                                    {[
                                        { id: 'overview', label: 'Overview', icon: Info },
                                        { id: 'financials', label: 'Financials', icon: Peso },
                                        { id: 'history', label: 'Service History', icon: History }
                                    ].map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center gap-2 pb-4 text-sm font-bold transition-all relative ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                                                }`}
                                        >
                                            <tab.icon className="w-4 h-4" />
                                            {tab.label}
                                            {activeTab === tab.id && (
                                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full animate-in fade-in slide-in-from-bottom-1" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Tab Content */}
                            <div className="p-8">
                                {activeTab === 'overview' && (
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in slide-in-from-left-4 duration-500">
                                        <div className="lg:col-span-8 space-y-8">
                                            <div>
                                                <h3 className="text-slate-800 font-black text-sm uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                                    <div className="w-1.5 h-4 bg-indigo-600 rounded-full" />
                                                    General Info
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                                    {/* Column 1 */}
                                                    <div className="space-y-6">
                                                        <InfoField
                                                            label="Name"
                                                            value={isEditing ? editFormData.name : selectedAsset.name}
                                                            editable={isEditing}
                                                            onChange={(val) => setEditFormData({ ...editFormData, name: val })}
                                                        />
                                                        <InfoField
                                                            label="Manufacturer"
                                                            value={isEditing ? editFormData.manufacturer : selectedAsset.manufacturer}
                                                            editable={isEditing}
                                                            onChange={(val) => setEditFormData({ ...editFormData, manufacturer: val })}
                                                        />
                                                        <InfoField
                                                            label="Serial #"
                                                            value={isEditing ? editFormData.serial : selectedAsset.serial}
                                                            editable={isEditing}
                                                            onChange={(val) => setEditFormData({ ...editFormData, serial: val })}
                                                        />
                                                        <InfoField
                                                            label="Condition"
                                                            value={isEditing ? editFormData.condition : selectedAsset.condition}
                                                            editable={isEditing}
                                                            onChange={(val) => setEditFormData({ ...editFormData, condition: val })}
                                                            options={['Excellent', 'Good', 'Fair', 'Poor', 'Broken', 'Critical']}
                                                        />
                                                        <InfoField
                                                            label="Quantity"
                                                            value={isEditing ? editFormData.quantity : (selectedAsset.quantity === 0 ? '0' : selectedAsset.quantity)}
                                                            editable={isEditing}
                                                            onChange={(val) => setEditFormData({ ...editFormData, quantity: val })}
                                                            type="number"
                                                        />
                                                        <InfoField
                                                            label="Status"
                                                            value={isEditing ? editFormData.status : (selectedAsset.quantity === 0 && isConsumables ? 'Out of Stock' : selectedAsset.status)}
                                                            editable={isEditing}
                                                            onChange={(val) => setEditFormData({ ...editFormData, status: val })}
                                                            options={['Available', 'Checked Out', 'Broken', 'In Repair']}
                                                        />
                                                    </div>

                                                    {/* Column 2 */}
                                                    <div className="space-y-6">
                                                        <InfoField
                                                            label="Barcode/Item #"
                                                            value={isEditing ? editFormData.barcode : (selectedAsset.barcode || selectedAsset.id)}
                                                            editable={isEditing}
                                                            onChange={(val) => setEditFormData({ ...editFormData, barcode: val })}
                                                        />
                                                        <InfoField
                                                            label="Model"
                                                            value={isEditing ? editFormData.model : selectedAsset.model}
                                                            editable={isEditing}
                                                            onChange={(val) => setEditFormData({ ...editFormData, model: val })}
                                                        />
                                                        <InfoField
                                                            label="Type"
                                                            value={isEditing ? editFormData.type : selectedAsset.type}
                                                            editable={isEditing}
                                                            onChange={(val) => setEditFormData({ ...editFormData, type: val })}
                                                            options={['Consumable', 'Supplies', 'Small Machine', 'Electronics', 'Furniture', 'Computer']}
                                                        />
                                                        <InfoField
                                                            label="Location"
                                                            value={isEditing ? editFormData.location : selectedAsset.location}
                                                            editable={isEditing}
                                                            onChange={(val) => setEditFormData({ ...editFormData, location: val })}
                                                            options={['NPI Plant', 'Del Monte Plant', 'Balulang Shop', 'EDP Conference Office', 'EDP Admin Office']}
                                                        />
                                                        <InfoField
                                                            label="Last Adjust"
                                                            value={isEditing ? editFormData.lastAdjust : selectedAsset.lastAdjust}
                                                            editable={isEditing}
                                                            onChange={(val) => setEditFormData({ ...editFormData, lastAdjust: val })}
                                                            type="date"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 ring-1 ring-slate-900/5 mt-8">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Item Description</label>
                                                    {isEditing ? (
                                                        <textarea
                                                            className="w-full bg-indigo-50/50 border border-indigo-100 rounded-xl px-4 py-3 text-sm font-bold text-indigo-600 outline-none focus:ring-1 focus:ring-indigo-500/30 min-h-[80px] resize-none"
                                                            value={editFormData.description || ''}
                                                            onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                                        />
                                                    ) : (
                                                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                                            {selectedAsset.description || 'No description provided.'}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 ring-1 ring-slate-900/5 mt-8">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Notes</label>
                                                    {isEditing ? (
                                                        <textarea
                                                            className="w-full bg-indigo-50/50 border border-indigo-100 rounded-xl px-4 py-3 text-sm font-bold text-indigo-600 outline-none focus:ring-1 focus:ring-indigo-500/30 min-h-[100px] resize-none"
                                                            value={editFormData.notes || ''}
                                                            onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                                                        />
                                                    ) : (
                                                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                                            {selectedAsset.notes || 'No critical maintenance notes found.'}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="lg:col-span-4 space-y-6">
                                            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm ring-1 ring-slate-900/5">
                                                <div className="relative group aspect-square rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden">
                                                    <input
                                                        type="file"
                                                        ref={fileInputRef}
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                    />
                                                    {(isEditing ? editFormData.imageUrl : selectedAsset.imageUrl) ? (
                                                        <img
                                                            src={isEditing ? editFormData.imageUrl : selectedAsset.imageUrl}
                                                            alt={selectedAsset.name}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                        />
                                                    ) : (
                                                        <Package className="w-24 h-24 text-slate-300 group-hover:scale-110 transition-transform duration-500" />
                                                    )}
                                                    {isEditing && (
                                                        <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-6">
                                                            <button
                                                                onClick={handleImageClick}
                                                                className="bg-white text-indigo-600 px-4 py-2 rounded-xl font-bold shadow-xl shadow-indigo-900/20 flex items-center gap-2 text-xs">
                                                                <Camera className="w-4 h-4" /> Change Picture
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className={`mt-6 p-5 rounded-2xl border-2 border-dashed transition-all ${['Checked Out', 'Out of Stock'].includes(selectedAsset.status)
                                                    ? 'bg-blue-50/50 border-blue-200'
                                                    : 'bg-emerald-50/50 border-emerald-200'
                                                    }`}>
                                                    {['Checked Out', 'Out of Stock'].includes(selectedAsset.status) || (selectedAsset.quantity === 0 && tableName === 'consumables_inventory') ? (
                                                        <div className="space-y-4">
                                                            <div className="flex items-center justify-between">
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">{selectedAsset.status === 'Out of Stock' || selectedAsset.quantity === 0 ? 'Stock Depleted' : 'Custody Status'}</p>
                                                                <div className="flex items-center gap-1.5">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                                                    <span className="text-[10px] font-bold text-blue-500 uppercase">{selectedAsset.status === 'Out of Stock' || selectedAsset.quantity === 0 ? 'Empty' : 'Live'}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                                    <User className="w-5 h-5 text-blue-600" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="flex items-center justify-between gap-4">
                                                                        <p className="text-sm font-black text-slate-800">{selectedAsset.checkedOutTo?.name}</p>
                                                                        <button
                                                                            onClick={() => {
                                                                                setCheckoutFormData({
                                                                                    checkOutDate: selectedAsset.checkedOutDate || new Date().toISOString().split('T')[0],
                                                                                    returnDue: selectedAsset.returnDue || '',
                                                                                    checkedOutBy: selectedAsset.activity?.[0]?.user || '',
                                                                                    jobsite: selectedAsset.checkedOutTo?.jobsite || '',
                                                                                    name: selectedAsset.checkedOutTo?.name || '',
                                                                                    email: selectedAsset.checkedOutTo?.email || '',
                                                                                    phone: selectedAsset.checkedOutTo?.phone || ''
                                                                                });
                                                                                setShowCheckoutModal(true);
                                                                            }}
                                                                            className="p-1 px-2.5 flex items-center gap-1.5 hover:bg-white text-slate-400 hover:text-indigo-600 rounded-lg transition-all border border-transparent hover:border-slate-200 shadow-sm"
                                                                        >
                                                                            <span className="text-[9px] font-black uppercase tracking-widest">Edit</span>
                                                                            <Pencil className="w-3 h-3" />
                                                                        </button>
                                                                    </div>
                                                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">{selectedAsset.checkedOutTo?.jobsite}</p>
                                                                </div>
                                                            </div>
                                                            <div className="bg-white/50 p-6 rounded-[2rem] border border-slate-100 ring-1 ring-slate-900/5 backdrop-blur-sm">
                                                                <button
                                                                    onClick={handleReturnSubmit}
                                                                    disabled={selectedAsset.status === 'Out of Stock' || (selectedAsset.quantity === 0 && isConsumables)}
                                                                    className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group/btn shadow-lg ${selectedAsset.status === 'Out of Stock' || (selectedAsset.quantity === 0 && isConsumables)
                                                                        ? 'bg-rose-600 text-white cursor-not-allowed border-none shadow-rose-200'
                                                                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
                                                                        }`}
                                                                >
                                                                    <CheckCircle2 className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                                                                    {selectedAsset.status === 'Out of Stock' || (selectedAsset.quantity === 0 && isConsumables) ? 'Out of Stock' : 'Mark as Returned'}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (() => {
                                                        const isOutOfStock = selectedAsset.quantity === 0 && isConsumables;
                                                        const isUnavailable =
                                                            ['In Repair', 'Broken', 'Out of Stock'].includes(selectedAsset.status) ||
                                                            ['Critical', 'Broken', 'Poor'].includes(selectedAsset.condition) ||
                                                            isOutOfStock;

                                                        if (isUnavailable) {
                                                            const unavailableReason = (selectedAsset.status === 'Out of Stock' || isOutOfStock) ? 'Zero Inventory - Out of Stock' : 'Unit Unavailable for Deployment';
                                                            return (
                                                                <div className="text-center space-y-4 py-2">
                                                                    <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto">
                                                                        <AlertCircle className="w-6 h-6 text-rose-600" />
                                                                    </div>
                                                                    <p className="text-xs font-black text-rose-600 tracking-wide uppercase px-4">{unavailableReason}</p>
                                                                    <button
                                                                        disabled
                                                                        className="w-full bg-slate-200 text-slate-400 py-3 rounded-2xl text-xs font-black cursor-not-allowed flex items-center justify-center gap-2"
                                                                    >
                                                                        Checkout <ChevronRight className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            );
                                                        }

                                                        return (
                                                            <div className="text-center space-y-4 py-2">
                                                                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                                                                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                                                                </div>
                                                                <p className="text-xs font-black text-emerald-600 tracking-wide">UNIT READY FOR DEPLOYMENT</p>

                                                                <button
                                                                    onClick={() => setActiveTab('history')}
                                                                    className="w-full py-3 bg-blue-600 text-white border border-blue-500 rounded-[1.2rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-md hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group/hist"
                                                                >
                                                                    <History className="w-3.5 h-3.5 group-hover/hist:scale-110 transition-transform text-blue-100" />
                                                                    Check Out History
                                                                </button>

                                                                <button
                                                                    onClick={() => {
                                                                        setCheckoutFormData({
                                                                            checkOutDate: new Date().toISOString().split('T')[0],
                                                                            returnDue: '',
                                                                            checkedOutBy: '',
                                                                            jobsite: '',
                                                                            name: '',
                                                                            email: '',
                                                                            phone: '',
                                                                            quantity: ''
                                                                        });
                                                                        setShowCheckoutModal(true);
                                                                    }}
                                                                    className="w-full bg-emerald-600 text-white py-3 rounded-2xl text-xs font-black shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                                                                >
                                                                    Checkout <ChevronRight className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'financials' && (
                                    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">

                                        <div>
                                            <h3 className="text-slate-800 font-black text-sm uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                                <div className="w-1.5 h-4 bg-indigo-600 rounded-full" />
                                                Unit Value Summary
                                            </h3>
                                            <div className="bg-white p-2 rounded-[1.5rem] border-2 border-indigo-900 overflow-hidden shadow-xl max-w-4xl">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    <div className="border border-indigo-900 overflow-hidden rounded-lg">
                                                        <div className="grid grid-cols-2 border-b border-indigo-900">
                                                            <div className="bg-slate-100 px-4 py-3 text-[11px] font-black text-slate-700 border-r border-indigo-900 flex items-center uppercase tracking-wider text-center">Original Cost</div>
                                                            <div className="bg-white px-4 py-3 text-sm font-mono text-right font-black text-slate-800 flex items-center justify-end tracking-wider">
                                                                {isEditing ? (
                                                                    <div className="flex items-center gap-1">
                                                                        <span className="text-indigo-600 font-bold">₱</span>
                                                                        <input
                                                                            type="number"
                                                                            className="w-24 bg-indigo-50 border border-indigo-100 rounded px-2 py-0.5 outline-none focus:ring-1 focus:ring-indigo-500/30 text-right"
                                                                            value={editFormData?.originalCost ?? ''}
                                                                            onChange={(e) => setEditFormData({ ...editFormData, originalCost: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                                                                            onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                                                                        />
                                                                    </div>
                                                                ) : (
                                                                    `₱${(Number(selectedAsset?.originalCost) || 0).toLocaleString()}`
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2">
                                                            <div className="bg-slate-100 px-4 py-3 text-[11px] font-black text-slate-700 border-r border-indigo-900 flex items-center uppercase tracking-wider text-center">Current Value</div>
                                                            <div className="bg-white px-4 py-3 text-sm font-mono text-right font-black text-slate-800 flex items-center justify-end tracking-wider">
                                                                {isEditing ? (
                                                                    <div className="flex items-center gap-1">
                                                                        <span className="text-indigo-600 font-bold">₱</span>
                                                                        <input
                                                                            type="number"
                                                                            className="w-24 bg-indigo-50 border border-indigo-100 rounded px-2 py-0.5 outline-none focus:ring-1 focus:ring-indigo-500/30 text-right"
                                                                            value={editFormData?.currentValue ?? ''}
                                                                            onChange={(e) => setEditFormData({ ...editFormData, currentValue: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                                                                            onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                                                                        />
                                                                    </div>
                                                                ) : (
                                                                    `₱${(Number(selectedAsset?.currentValue) || 0).toLocaleString()}`
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="border border-indigo-900 overflow-hidden rounded-lg">
                                                        <div className="grid grid-cols-2 border-b border-indigo-900">
                                                            <div className="bg-slate-100 px-4 py-3 text-[11px] font-black text-slate-700 border-r border-indigo-900 flex items-center uppercase tracking-wider text-center">Total App/Dep</div>
                                                            <div className="bg-white px-4 py-3 text-sm font-mono text-right font-black text-slate-800 flex items-center justify-end tracking-wider">
                                                                ₱{((Number(selectedAsset?.currentValue) || 0) - (Number(selectedAsset?.originalCost) || 0)).toLocaleString()}
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2">
                                                            <div className="bg-slate-100 px-4 py-3 text-[11px] font-black text-slate-700 border-r border-indigo-900 flex items-center uppercase tracking-wider text-center">Total Repairs</div>
                                                            <div className="bg-white px-4 py-3 text-sm font-mono text-right font-black text-slate-800 flex items-center justify-end tracking-wider">₱0</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'history' && (
                                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="max-w-4xl relative ml-6">
                                            <div className="absolute left-[23px] top-0 bottom-0 w-0.5 bg-slate-100" />
                                            <div className="space-y-8 relative">
                                                {(selectedAsset.activity || []).length > 0 ? (
                                                    <>
                                                        {(showFullHistory ? selectedAsset.activity : selectedAsset.activity.slice(0, 3)).map((item, i) => (
                                                            <div key={i} className="flex items-start gap-10 group">
                                                                <div className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center z-10 shadow-sm group-hover:border-indigo-500 group-hover:scale-110 transition-all duration-500">
                                                                    <Activity className="w-5 h-5 text-indigo-600" />
                                                                </div>
                                                                <div className="flex-1 bg-slate-50/50 p-6 rounded-3xl border border-slate-100 group-hover:bg-white group-hover:shadow-xl group-hover:shadow-indigo-500/5 transition-all">
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <p className="text-sm font-black text-slate-800">{item.action}</p>
                                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.date}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                                                                            <User className="w-3.5 h-3.5" />
                                                                            {item.user}
                                                                        </div>
                                                                        <div className="flex items-center gap-1.5">
                                                                            <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'Good' || item.status === 'New' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                                            <span className="text-[10px] font-black text-slate-400 uppercase">{item.status}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}

                                                        {selectedAsset.activity.length > 3 && (
                                                            <div className="flex justify-center ml-20 pt-4">
                                                                <button
                                                                    onClick={() => setShowFullHistory(!showFullHistory)}
                                                                    className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all shadow-sm group/btn"
                                                                >
                                                                    {showFullHistory ? (
                                                                        <>
                                                                            <ChevronDown className="w-3 h-3 rotate-180 group-hover/btn:-translate-y-0.5 transition-transform" />
                                                                            Show Less History
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Plus className="w-3 h-3 group-hover/btn:rotate-90 transition-transform" />
                                                                            Show Entire History ({selectedAsset.activity.length})
                                                                        </>
                                                                    )}
                                                                </button>
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center py-20 text-center">
                                                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-4">
                                                            <History className="w-10 h-10 text-slate-200" />
                                                        </div>
                                                        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No service history available</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                {/* Checkout Modal - rendered via portal to escape overflow-auto stacking context */}
                {
                    showCheckoutModal && ReactDOM.createPortal(
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                            <div className="bg-white/95 backdrop-blur-md w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-100/80 overflow-hidden animate-in zoom-in-95 duration-300">
                                <div className="p-3.5 px-4 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 bg-indigo-50 border border-indigo-100 rounded-lg shadow-sm">
                                            <ClipboardList className="w-4 h-4 text-indigo-600" />
                                        </div>
                                        <div className="max-w-[200px]">
                                            <h2 className="text-xl font-black text-black tracking-tight leading-none uppercase">Check Out Info</h2>
                                            <p className="text-[12px] font-black text-slate-900 uppercase tracking-widest mt-1.5 truncate">{selectedAsset?.name}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowCheckoutModal(false)}
                                        className="p-1 px-3 flex items-center gap-2 hover:bg-slate-50 text-slate-400 hover:text-rose-500 rounded-full transition-all border border-slate-100/50 hover:border-slate-200"
                                    >
                                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">Close</span>
                                        <X className="w-5 h-5 text-slate-900" />
                                    </button>
                                </div>

                                <form onSubmit={handleCheckoutSubmit} className="p-3.5 space-y-3">
                                    <div className="space-y-2.5">
                                        {/* Group 1: Timing Details */}
                                        <div className="grid grid-cols-2 gap-2.5">
                                            <div className="relative group overflow-hidden rounded-xl border border-slate-100 bg-slate-50/50 p-2 transition-all focus-within:ring-2 focus-within:ring-indigo-500/10 focus-within:border-indigo-500/50 focus-within:bg-white">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1 bg-white rounded-md shadow-sm border border-slate-100 group-focus-within:bg-indigo-600 group-focus-within:border-indigo-600 transition-colors">
                                                        <Calendar className="w-2.5 h-2.5 text-indigo-600 group-focus-within:text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="text-[11px] font-black text-black uppercase tracking-widest block">Check Out</label>
                                                        <input
                                                            type="date"
                                                            className="w-full bg-transparent border-none p-0 text-sm font-bold text-black focus:ring-0 outline-none cursor-pointer"
                                                            value={checkoutFormData.checkOutDate}
                                                            onChange={(e) => setCheckoutFormData({ ...checkoutFormData, checkOutDate: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="relative group overflow-hidden rounded-xl border border-slate-100 bg-slate-50/50 p-2 transition-all focus-within:ring-2 focus-within:ring-rose-500/10 focus-within:border-rose-500/50 focus-within:bg-white">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1 bg-white rounded-md shadow-sm border border-slate-100 group-focus-within:bg-rose-500 group-focus-within:border-rose-500 transition-colors">
                                                        <Clock className="w-2.5 h-2.5 text-rose-500 group-focus-within:text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="text-[11px] font-black text-black uppercase tracking-widest block">Return Date <span className="text-[9px] opacity-50 ml-1 lowercase font-bold">(Optional)</span></label>
                                                        <input
                                                            type="date"
                                                            className="w-full bg-transparent border-none p-0 text-sm font-bold text-black focus:ring-0 outline-none cursor-pointer"
                                                            value={checkoutFormData.returnDue}
                                                            onChange={(e) => setCheckoutFormData({ ...checkoutFormData, returnDue: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Group 2: Assignment Details */}
                                        <div className="grid grid-cols-2 gap-2.5">
                                            <div className="relative group rounded-xl border border-slate-100 bg-slate-50/50 p-2 transition-all focus-within:ring-2 focus-within:ring-amber-500/10 focus-within:border-amber-500/50 focus-within:bg-white">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1 bg-white rounded-md shadow-sm border border-slate-100 group-focus-within:bg-amber-500 group-focus-within:border-amber-500 transition-colors">
                                                        <User className="w-2.5 h-2.5 text-amber-500 group-focus-within:text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="text-[11px] font-black text-black uppercase tracking-widest block">Check out by:</label>
                                                        <input
                                                            type="text"
                                                            placeholder=""
                                                            className="w-full bg-transparent border-none p-0 text-sm font-bold text-black focus:ring-0 outline-none placeholder:text-slate-400"
                                                            value={checkoutFormData.checkedOutBy}
                                                            onChange={(e) => setCheckoutFormData({ ...checkoutFormData, checkedOutBy: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="relative group rounded-xl border border-slate-100 bg-slate-50/50 p-2 transition-all focus-within:ring-2 focus-within:ring-indigo-500/10 focus-within:border-indigo-500/50 focus-within:bg-white">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1 bg-white rounded-md shadow-sm border border-slate-100 group-focus-within:bg-indigo-600 group-focus-within:border-indigo-600 transition-colors">
                                                        <MapPin className="w-2.5 h-2.5 text-indigo-600 group-focus-within:text-white" />
                                                    </div>
                                                    <div className="flex-1 relative" ref={jobsiteDropdownRef}>
                                                        <label className="text-[11px] font-black text-black uppercase tracking-widest block">Jobsite/Area</label>
                                                        <div className="relative mt-1">
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowJobsiteDropdown(!showJobsiteDropdown)}
                                                                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-0 py-1.5 text-xs font-bold text-black focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all outline-none flex items-center justify-between group/js cursor-pointer"
                                                            >
                                                                <span className={!checkoutFormData.jobsite ? 'text-slate-400' : 'text-black'}>
                                                                    {checkoutFormData.jobsite || 'Select Location'}
                                                                </span>
                                                                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-all duration-300 ${showJobsiteDropdown ? 'rotate-180 text-indigo-600' : 'group-hover/js:text-indigo-400'}`} />
                                                            </button>

                                                            {showJobsiteDropdown && (
                                                                <div className="absolute top-full left-[-10px] right-[-10px] mt-2 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 py-2.5 z-[100] animate-in fade-in zoom-in-95 duration-200 ring-1 ring-slate-900/5">
                                                                    <div className="max-h-[160px] overflow-y-auto custom-scrollbar px-1.5">
                                                                        {['NPI Plant', 'Del Monte Plant', 'Balulang Shop', 'EDP Conference Office', 'EDP Admin Office'].map((loc) => (
                                                                            <button
                                                                                key={loc}
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    setCheckoutFormData({ ...checkoutFormData, jobsite: loc });
                                                                                    setShowJobsiteDropdown(false);
                                                                                }}
                                                                                className={`w-full px-3.5 py-2.5 text-left text-[13px] font-bold rounded-xl transition-all flex items-center justify-between group/opt mb-0.5 last:mb-0 ${checkoutFormData.jobsite === loc
                                                                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                                                                    : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                                                                                    }`}
                                                                            >
                                                                                <span className="truncate">{loc}</span>
                                                                                {checkoutFormData.jobsite === loc && (
                                                                                    <Check className="w-3.5 h-3.5 text-white" />
                                                                                )}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Conditional Quantity Field */}
                                        {selectedAsset?.quantity > 0 && (
                                            <div className="flex justify-center">
                                                <div className="w-1/2 relative group overflow-hidden rounded-xl border border-slate-100 bg-slate-50/50 p-2 transition-all focus-within:ring-2 focus-within:ring-indigo-500/10 focus-within:border-indigo-500/50 focus-within:bg-white">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1 bg-white rounded-md shadow-sm border border-slate-100 group-focus-within:bg-indigo-600 group-focus-within:border-indigo-600 transition-colors">
                                                            <Hash className="w-2.5 h-2.5 text-indigo-600 group-focus-within:text-white" />
                                                        </div>
                                                        <div className="flex-1 text-center">
                                                            <label className="text-[11px] font-black text-black uppercase tracking-widest block">Quantity</label>
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                max={selectedAsset.quantity}
                                                                className="w-full bg-transparent border-none p-0 text-sm font-bold text-black focus:ring-0 outline-none text-center"
                                                                value={checkoutFormData.quantity}
                                                                onChange={(e) => setCheckoutFormData({ ...checkoutFormData, quantity: e.target.value })}
                                                                onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Group 3: Custodian Data */}
                                        <div className="rounded-2xl p-3 relative overflow-hidden group/custodian transition-all duration-500 border border-slate-100 bg-slate-50/50 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/10 focus-within:border-indigo-500/50">
                                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/custodian:opacity-10 transition-opacity">
                                                <Package className="w-16 h-16 text-indigo-900 -rotate-12" />
                                            </div>
                                            <div className="relative z-10">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="h-px w-4 bg-black/10" />
                                                    <span className="text-[11px] font-black text-black uppercase tracking-[0.3em]">Check out Details</span>
                                                    <div className="h-px flex-1 bg-black/10" />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="relative group overflow-hidden rounded-xl border border-slate-100 bg-white/50 p-2 transition-all focus-within:ring-2 focus-within:ring-indigo-500/5 focus-within:border-indigo-500/30 focus-within:bg-white">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-5 h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center group-focus-within:bg-slate-900 group-focus-within:border-slate-900 transition-colors">
                                                                <User className="w-2.5 h-2.5 text-slate-400 group-focus-within:text-white" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <label className="text-[10px] font-black text-black uppercase tracking-widest block">Name</label>
                                                                <input
                                                                    type="text"
                                                                    placeholder=""
                                                                    className="w-full bg-transparent border-none p-0 text-sm font-bold text-black focus:ring-0 outline-none placeholder:text-slate-400"
                                                                    value={checkoutFormData.name}
                                                                    onChange={(e) => setCheckoutFormData({ ...checkoutFormData, name: e.target.value })}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="relative group overflow-hidden rounded-xl border border-slate-100 bg-white/50 p-2 transition-all focus-within:ring-2 focus-within:ring-indigo-500/5 focus-within:border-indigo-500/30 focus-within:bg-white">
                                                            <div className="flex items-center gap-2">
                                                                <div className="min-w-[20px] h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center group-focus-within:bg-slate-900 group-focus-within:border-slate-900 transition-colors">
                                                                    <Package className="w-2.5 h-2.5 text-slate-400 group-focus-within:text-white" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <label className="text-[10px] font-black text-black uppercase tracking-widest block">Email</label>
                                                                    <input
                                                                        type="email"
                                                                        placeholder=""
                                                                        className="w-full bg-transparent border-none p-0 text-[12px] font-bold text-black focus:ring-0 outline-none placeholder:text-slate-400 truncate"
                                                                        value={checkoutFormData.email}
                                                                        onChange={(e) => setCheckoutFormData({ ...checkoutFormData, email: e.target.value })}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="relative group overflow-hidden rounded-xl border border-slate-100 bg-white/50 p-2 transition-all focus-within:ring-2 focus-within:ring-indigo-500/5 focus-within:border-indigo-500/30 focus-within:bg-white">
                                                            <div className="flex items-center gap-2">
                                                                <div className="min-w-[20px] h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center group-focus-within:bg-slate-900 group-focus-within:border-slate-900 transition-colors">
                                                                    <MapPin className="w-2.5 h-2.5 text-slate-400 group-focus-within:text-white" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <label className="text-[10px] font-black text-black uppercase tracking-widest block">Phone</label>
                                                                    <input
                                                                        type="tel"
                                                                        placeholder=""
                                                                        maxLength="11"
                                                                        inputMode="numeric"
                                                                        className="w-full bg-transparent border-none p-0 text-[12px] font-bold text-black focus:ring-0 outline-none placeholder:text-slate-400 truncate"
                                                                        value={checkoutFormData.phone}
                                                                        onChange={(e) => {
                                                                            const val = e.target.value.replace(/\D/g, '');
                                                                            if (val.length <= 11) {
                                                                                setCheckoutFormData({ ...checkoutFormData, phone: val });
                                                                            }
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-4 px-6 bg-slate-900 text-white rounded-2xl text-[13px] font-black shadow-xl hover:bg-black transition-all hover:-translate-y-0.5 active:scale-95 active:translate-y-0 uppercase tracking-[0.2em] relative overflow-hidden group"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            Checkout <ChevronRight className="w-5 h-5" />
                                        </span>
                                    </button>
                                </form>
                            </div>
                        </div>
                        , document.body)
                }

                {/* Delete Confirmation Modal */}
                {
                    showDeleteModal && ReactDOM.createPortal(
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                            <div className="bg-white/95 backdrop-blur-md w-full max-w-sm rounded-[2rem] shadow-2xl border border-slate-100/80 overflow-hidden animate-in zoom-in-95 duration-300">
                                <div className="p-6 text-center space-y-6">
                                    <div className="w-20 h-20 bg-rose-50 border-2 border-rose-100 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                                        <Trash2 className="w-10 h-10 text-rose-600" />
                                    </div>

                                    <div className="space-y-2">
                                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Delete Unit?</h2>
                                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                            Are you sure you want to delete <span className="font-black text-slate-800">{selectedAsset?.name}</span>? This action cannot be undone.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 pt-2">
                                        <button
                                            onClick={() => setShowDeleteModal(false)}
                                            className="py-3.5 bg-slate-100 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                                        >
                                            No, Keep it
                                        </button>
                                        <button
                                            onClick={handleDeleteConfirm}
                                            className="py-3.5 bg-rose-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-rose-700 shadow-xl shadow-rose-200 transition-all active:scale-95"
                                        >
                                            Yes, Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        , document.body)
                }

                {/* Add Entry Modal */}
                {
                    showAddModal && ReactDOM.createPortal(
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                            <div className="bg-white/95 backdrop-blur-md w-full max-w-4xl rounded-[2.5rem] shadow-2xl border border-slate-100/80 overflow-hidden animate-in zoom-in-95 duration-300">
                                <div className="p-3.5 px-6 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <h2 className="text-xl font-black text-black tracking-tight leading-none uppercase">Create New Unit</h2>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowAddModal(false)}
                                        className="p-2 hover:bg-slate-50 text-slate-400 hover:text-rose-500 rounded-full transition-all"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <form onSubmit={handleAddSubmit} className="p-6 space-y-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                        {/* Left Column: Picture and Primary Info */}
                                        <div className="lg:col-span-4 space-y-6">
                                            <div className="relative group aspect-square rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden">
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    id="add-unit-image"
                                                    accept="image/*"
                                                    onChange={handleAddImageChange}
                                                />
                                                {newAssetFormData.imageUrl ? (
                                                    <img
                                                        src={newAssetFormData.imageUrl}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <Package className="w-16 h-16 text-slate-300" />
                                                )}
                                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <label
                                                        htmlFor="add-unit-image"
                                                        className="bg-white text-slate-900 px-4 py-2 rounded-xl font-bold text-xs cursor-pointer shadow-xl flex items-center gap-2"
                                                    >
                                                        <Camera className="w-4 h-4" /> Change Picture
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Status</label>
                                                    <select
                                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all outline-none"
                                                        value={newAssetFormData.status}
                                                        onChange={(e) => setNewAssetFormData({ ...newAssetFormData, status: e.target.value })}
                                                    >
                                                        <option>Available</option>
                                                        <option>Checked Out</option>
                                                        <option>Broken</option>
                                                        <option>In Repair</option>
                                                    </select>
                                                </div>
                                                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Condition</label>
                                                    <select
                                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all outline-none"
                                                        value={newAssetFormData.condition}
                                                        onChange={(e) => setNewAssetFormData({ ...newAssetFormData, condition: e.target.value })}
                                                    >
                                                        <option>Excellent</option>
                                                        <option>Good</option>
                                                        <option>Fair</option>
                                                        <option>Poor</option>
                                                        <option>Broken</option>
                                                        <option>Critical</option>
                                                    </select>
                                                </div>
                                                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Quantity</label>
                                                    <input
                                                        type="number"
                                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all outline-none"
                                                        value={newAssetFormData.quantity}
                                                        onChange={(e) => setNewAssetFormData({ ...newAssetFormData, quantity: e.target.value })}
                                                        onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                                                        min="0"
                                                    />
                                                </div>
                                            </div>
                                        </div>


                                        {/* Right Column: Form Sections */}
                                        <div className="lg:col-span-8 space-y-8">
                                            {/* Section: General */}
                                            <div className="space-y-4">
                                                <h3 className="text-[11px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                                                    <div className="w-1 h-3 bg-indigo-600 rounded-full" /> {isConsumables ? 'Item Details' : 'Unit Details'}
                                                </h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{isConsumables ? 'Item Name' : 'Unit Name'}</label>
                                                        <input
                                                            type="text"
                                                            required
                                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all outline-none"
                                                            value={newAssetFormData.name}
                                                            onChange={(e) => setNewAssetFormData({ ...newAssetFormData, name: e.target.value })}
                                                            placeholder=""
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
                                                        <select
                                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all outline-none"
                                                            value={newAssetFormData.type}
                                                            onChange={(e) => setNewAssetFormData({ ...newAssetFormData, type: e.target.value })}
                                                        >
                                                            <option>Consumable</option>
                                                            <option>Supplies</option>
                                                            <option>Small Machine</option>
                                                            <option>Electronics</option>
                                                            <option>Furniture</option>
                                                            <option>Computer</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Manufacturer</label>
                                                        <input
                                                            type="text"
                                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all outline-none"
                                                            value={newAssetFormData.manufacturer}
                                                            onChange={(e) => setNewAssetFormData({ ...newAssetFormData, manufacturer: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Model</label>
                                                        <input
                                                            type="text"
                                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all outline-none"
                                                            value={newAssetFormData.model}
                                                            onChange={(e) => setNewAssetFormData({ ...newAssetFormData, model: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Serial #</label>
                                                        <input
                                                            type="text"
                                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all outline-none"
                                                            value={newAssetFormData.serial}
                                                            onChange={(e) => setNewAssetFormData({ ...newAssetFormData, serial: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
                                                        <select
                                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all outline-none"
                                                            value={newAssetFormData.location}
                                                            onChange={(e) => setNewAssetFormData({ ...newAssetFormData, location: e.target.value })}
                                                        >
                                                            <option>NPI Plant</option>
                                                            <option>Del Monte Plant</option>
                                                            <option>Balulang Shop</option>
                                                            <option>EDP Conference Office</option>
                                                            <option>EDP Admin Office</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-span-2 space-y-1.5">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Item Description</label>
                                                        <textarea
                                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all outline-none min-h-[80px] resize-none"
                                                            value={newAssetFormData.description}
                                                            onChange={(e) => setNewAssetFormData({ ...newAssetFormData, description: e.target.value })}
                                                            placeholder=""
                                                        />
                                                    </div>
                                                </div>



                                                {/* Section: Financials */}
                                                <div className="space-y-4">
                                                    <h3 className="text-[11px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                                                        <div className="w-1 h-3 bg-emerald-600 rounded-full" /> Financial Appraisal
                                                    </h3>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Original Cost (<Peso className="text-[8px]" />)</label>
                                                            <input
                                                                type="number"
                                                                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all outline-none"
                                                                value={newAssetFormData.originalCost}
                                                                onChange={(e) => setNewAssetFormData({ ...newAssetFormData, originalCost: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                                                                onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Valuation (<Peso className="text-[8px]" />)</label>
                                                            <input
                                                                type="number"
                                                                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all outline-none"
                                                                value={newAssetFormData.currentValue}
                                                                onChange={(e) => setNewAssetFormData({ ...newAssetFormData, currentValue: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                                                                onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Section: Notes */}
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Notes</label>
                                                    <textarea
                                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all outline-none min-h-[100px] resize-none"
                                                        value={newAssetFormData.notes}
                                                        onChange={(e) => setNewAssetFormData({ ...newAssetFormData, notes: e.target.value })}
                                                        placeholder=""
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 pt-6 border-t border-slate-100">
                                        <button
                                            type="button"
                                            onClick={() => setShowAddModal(false)}
                                            className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-black shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            Create Unit<ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        , document.body)
                }

            </>
        </div >
    );
};

// Helper Component for Info Fields
const InfoField = ({ label, value, editable, onChange, type = "text", options }) => (
    <div className="flex justify-between items-center text-sm border-b border-slate-200 pb-1.5 border-dashed last:border-0 last:pb-0">
        <span className="text-slate-400 font-bold uppercase tracking-tight text-[10px]">{label}</span>
        {editable ? (
            options ? (
                <select
                    className="bg-indigo-50/50 border border-indigo-100 rounded-md px-2 py-0.5 text-xs font-bold text-indigo-600 outline-none focus:ring-1 focus:ring-indigo-500/30"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                >
                    {options.map(opt => <option key={opt}>{opt}</option>)}
                </select>
            ) : (
                <input
                    type={type}
                    className="bg-indigo-50/50 border border-indigo-100 rounded-md px-2 py-0.5 text-xs font-bold text-indigo-600 outline-none focus:ring-1 focus:ring-indigo-500/30 text-right w-32"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={(e) => {
                        if (type === 'number' && ['e', 'E', '+', '-'].includes(e.key)) {
                            e.preventDefault();
                        }
                    }}
                />
            )
        ) : (
            <span className="text-slate-700 font-black text-right flex-1 ml-4">{value || '-'}</span>
        )}
    </div>
);

export default Inventory;
