import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
// import axios from 'axios';
import { 
  ChevronLeft, ChevronRight, FileText, Download, Printer, Calendar, 
  Sparkles, TrendingUp, Bookmark, BookmarkCheck 
} from 'lucide-react';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';



import { formatDate } from '../utils/date';


const RevisionHub = () => {
    const [activeTab, setActiveTab] = useState('daily');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [gkData, setGkData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchGK = async () => {
            // const token = localStorage.getItem('token');
            // if (!token) return;
            
            setLoading(true);
            try {
                let url;
                if (activeTab === 'daily') {
                    const dateStr = formatDate(selectedDate);
                    url = `/api/gk/date/${dateStr}`;
                } else if (activeTab === 'monthly') {
                    const year = currentMonth.getFullYear();
                    const month = currentMonth.getMonth() + 1;
                    url = `/api/gk/month/${year}/${month}`;
                } else if (activeTab === 'yearly') {
                    url = `/api/gk/yearly/${selectedYear}`;
                }

                if (url) {
                    const res = await axios.get(url, 
                        //{ headers: { Authorization: `Bearer ${token}` }}
                    );
                    setGkData(res.data);
                }
            } catch (error) {
                console.error("Error fetching revision data", error);
                setGkData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchGK();
    }, [activeTab, selectedDate, currentMonth, selectedYear]);

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { days, firstDay };
    };

    const renderCalendar = () => {
        const { days, firstDay } = getDaysInMonth(currentMonth);
        const calendarDays = [];
        
        for (let i = 0; i < firstDay; i++) {
            calendarDays.push(<div key={`empty-${i}`} className="h-10"></div>);
        }
        
        for (let i = 1; i <= days; i++) {
            const isSelected = selectedDate.getDate() === i && selectedDate.getMonth() === currentMonth.getMonth() && selectedDate.getFullYear() === currentMonth.getFullYear();
            const isToday = new Date().getDate() === i && new Date().getMonth() === currentMonth.getMonth() && new Date().getFullYear() === currentMonth.getFullYear();
            
            calendarDays.push(
                <button
                    key={`day-${currentMonth.getFullYear()}-${currentMonth.getMonth()}-${i}`}
                    onClick={() => setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i))}
                    className={`h-10 w-10 rounded-xl flex items-center justify-center text-sm font-semibold transition-all duration-300 mx-auto relative overflow-hidden transform hover:scale-110 hover:-translate-y-1 ${
                        isSelected 
                            ? "bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white shadow-lg shadow-blue-500/50 ring-2 ring-blue-300" 
                            : "hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 text-gray-700 dark:text-gray-300 hover:shadow-md"
                    } ${isToday && !isSelected ? "border-2 border-blue-500 text-blue-600 dark:text-blue-400 font-bold shadow-sm" : ""}`}
                >
                    <span className="relative z-10">{i}</span>
                </button>
            );
        }
        
        return calendarDays;
    };

    const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

   const exportPDF = () => {
    if (!gkData || gkData.length === 0) {
        alert("No GK data to export");
        return;
    }

    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.text("Revision Hub – GK Report", 14, 15);

    // Subtitle
    doc.setFontSize(11);
    doc.text(
        activeTab === 'daily'
            ? `Date: ${formatDate(selectedDate)}`
            : activeTab === 'monthly'
            ? `Month: ${currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}`
            : `Year: ${selectedYear}`,
        14,
        25
    );

    // Table data
    const tableData = gkData.map((item, index) => [
        index + 1,
        item.category,
        item.priority,
        item.content
    ]);

    autoTable(doc, {
    startY: 35,
    head: [['#', 'Category', 'Priority', 'Content']],
    body: tableData,
    styles: {
        fontSize: 10,
        cellPadding: 3,
    },
    headStyles: {
        fillColor: [59, 130, 246],
    },
    columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 30 },
        2: { cellWidth: 25 },
        3: { cellWidth: 115 },
    },

    // ✅ PAGE NUMBER FOOTER
    didDrawPage: function (data) {
        const pageCount = doc.internal.getNumberOfPages();
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height || pageSize.getHeight();

        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text(
            `Page ${pageCount}`,
            pageSize.width / 2,
            pageHeight - 8,
            { align: 'center' }
        );
    }
});



    // Save
    doc.save(`GK_${activeTab}_${Date.now()}.pdf`);
};

    const handlePrint = () => {
        window.print();
    };

    const toggleBookmark = async (id, isBookmarked) => {
    // const token = localStorage.getItem('token');
    // if (!token) return;

    try {
        if (isBookmarked) {
            await axios.delete(`/api/gk/bookmark/${id}`, 
                //{ headers: { Authorization: `Bearer ${token}` }}
            );
        } else {
            await axios.post(
                `/api/gk/bookmark`,
                { gk_id: id },
                // { headers: { Authorization: `Bearer ${token}` } }
            );
        }

        setGkData(prev =>
            prev.map(point =>
                point.id === id
                    ? { ...point, isBookmarked: !isBookmarked }
                    : point
            )
        );
    } catch (err) {
        console.error("Bookmark toggle failed", err);
    }
};


    const priorityStats = {
        high: gkData.filter(p => p.priority === 'High').length,
        medium: gkData.filter(p => p.priority === 'Medium').length,
        low: gkData.filter(p => p.priority === 'Low').length
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-indigo-900/10 p-6 space-y-8 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 animate-fade-in">
                <div className="flex items-center space-x-3">
                    <div className="animate-spin-slow">
                        <Sparkles className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />
                    </div>
                    <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
                        Revision Hub
                    </h1>
                </div>
                
                <div className="flex space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-2 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
                    {['daily', 'monthly', 'yearly'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all duration-300 relative overflow-hidden transform hover:scale-105 ${
                                activeTab === tab 
                                    ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white shadow-lg shadow-blue-500/50" 
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 hover:shadow-md"
                            }`}
                        >
                            <span className="relative z-10">{tab} Archive</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sidebar / Controls */}
                <div className="lg:col-span-1 space-y-6 print:hidden">
                    {activeTab === 'daily' && (
                        <div className="bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-900/10 rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <button 
                                    onClick={handlePrevMonth} 
                                    className="p-2.5 hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 rounded-xl transition-all hover:text-white text-blue-600 dark:text-blue-400 shadow-md hover:shadow-lg transform hover:scale-110 hover:-translate-x-1"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <span className="font-bold text-gray-900 dark:text-white text-lg tracking-wide">
                                    {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                </span>
                                <button 
                                    onClick={handleNextMonth} 
                                    className="p-2.5 hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 rounded-xl transition-all hover:text-white text-blue-600 dark:text-blue-400 shadow-md hover:shadow-lg transform hover:scale-110 hover:translate-x-1"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-center mb-4">
                                {['S','M','T','W','T','F','S'].map((d, i) => (
                                    <span key={i} className="text-xs font-bold text-gray-500 dark:text-gray-400">{d}</span>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-2">
                                {renderCalendar()}
                            </div>
                            <div className="mt-6 text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    Selected: <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{selectedDate.toLocaleDateString()}</span>
                                </span>
                            </div>
                        </div>
                    )}

                    {activeTab === 'monthly' && (
                        <div className="bg-gradient-to-br from-white to-indigo-50/30 dark:from-gray-800 dark:to-indigo-900/10 rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg flex items-center">
                                <Calendar className="w-5 h-5 mr-2 text-indigo-500" />
                                Select Month
                            </h3>
                            <div className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-200/50 dark:border-blue-700/50 shadow-inner">
                                <button 
                                    onClick={handlePrevMonth} 
                                    className="p-2.5 bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-xl transition-all text-indigo-600 dark:text-indigo-400 hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 hover:text-white transform hover:scale-110 hover:-translate-x-1"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <span className="font-bold text-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                </span>
                                <button 
                                    onClick={handleNextMonth} 
                                    className="p-2.5 bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-xl transition-all text-indigo-600 dark:text-indigo-400 hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 hover:text-white transform hover:scale-110 hover:translate-x-1"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'yearly' && (
                        <div className="bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-800 dark:to-purple-900/10 rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg flex items-center">
                                <TrendingUp className="w-5 h-5 mr-2 text-purple-500" />
                                Select Year
                            </h3>
                            <div className="flex justify-between items-center bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl border border-purple-200/50 dark:border-purple-700/50 shadow-inner">
                                <button 
                                    onClick={() => setSelectedYear(selectedYear - 1)} 
                                    className="p-2.5 bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-xl transition-all text-purple-600 dark:text-purple-400 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transform hover:scale-110 hover:-translate-x-1"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <span className="font-bold text-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                                    {selectedYear}
                                </span>
                                <button 
                                    onClick={() => setSelectedYear(selectedYear + 1)} 
                                    className="p-2.5 bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-xl transition-all text-purple-600 dark:text-purple-400 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transform hover:scale-110 hover:translate-x-1"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Stats Card */}
                    {gkData.length > 0 && (
                        <div className="bg-gradient-to-br from-white to-green-50/30 dark:from-gray-800 dark:to-green-900/10 p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
                            <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                                <TrendingUp className="w-5 h-5 mr-2 text-green-500" /> Priority Breakdown
                            </h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/20 rounded-xl border border-red-200 dark:border-red-800 shadow-sm transition-all hover:shadow-md hover:scale-105 hover:-translate-y-1">
                                    <span className="text-sm font-semibold text-red-700 dark:text-red-300">High Priority</span>
                                    <span className="text-lg font-bold text-red-600 dark:text-red-400">{priorityStats.high}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-yellow-100/50 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl border border-yellow-200 dark:border-yellow-800 shadow-sm transition-all hover:shadow-md hover:scale-105 hover:-translate-y-1">
                                    <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">Medium Priority</span>
                                    <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{priorityStats.medium}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-800 shadow-sm transition-all hover:shadow-md hover:scale-105 hover:-translate-y-1">
                                    <span className="text-sm font-semibold text-green-700 dark:text-green-300">Low Priority</span>
                                    <span className="text-lg font-bold text-green-600 dark:text-green-400">{priorityStats.low}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Export Options */}
                    <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-6 rounded-2xl shadow-xl border border-blue-300/50 dark:border-blue-700/50 transition-all duration-300 hover:shadow-2xl hover:scale-105">
                        <h4 className="font-bold text-white mb-4 flex items-center">
                            <Download className="w-5 h-5 mr-2" /> Export Options
                        </h4>
                        <div className="space-y-3">
                            <button 
                                onClick={exportPDF}
                                disabled={gkData.length === 0}
                                className="w-full flex items-center justify-center space-x-2 bg-white dark:bg-gray-800 py-3.5 px-4 rounded-xl text-indigo-700 dark:text-indigo-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/40 dark:hover:to-purple-900/40 hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold border border-indigo-200/50 dark:border-indigo-700/50 transform hover:scale-105 hover:-translate-y-1"
                            >
                                <FileText className="w-5 h-5" />
                                <span>Download PDF</span>
                            </button>
                            <button 
                                onClick={handlePrint}
                                disabled={gkData.length === 0}
                                className="w-full flex items-center justify-center space-x-2 bg-white/90 dark:bg-gray-800/90 py-3.5 px-4 rounded-xl text-purple-700 dark:text-purple-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/40 dark:hover:to-pink-900/40 hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold border border-purple-200/50 dark:border-purple-700/50 transform hover:scale-105 hover:-translate-y-1"
                            >
                                <Printer className="w-5 h-5" />
                                <span>Print View</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2 print-area">

                    {loading ? (
                        <div className="flex flex-col justify-center items-center h-64 bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-900/10 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 dark:border-blue-400"></div>
                            <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Loading GK data...</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between mb-2 flex-wrap gap-3">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                                    <span className="bg-gradient-to-r from-blue-500 to-purple-600 w-1.5 h-8 rounded-full mr-3"></span>
                                    {activeTab === 'daily' 
                                        ? `GK for ${selectedDate.toLocaleDateString()}` 
                                        : (activeTab === 'monthly' 
                                            ? `GK Digest: ${currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}`
                                            : `Yearly Compilation: ${selectedYear}`)
                                    }
                                </h2>
                                <span className="text-sm font-bold px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-lg shadow-blue-500/50">
                                    {gkData.length} Points
                                </span>
                            </div>

                            {gkData.length === 0 ? (
                                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-16 rounded-2xl shadow-xl text-center border-2 border-dashed border-gray-300 dark:border-gray-700 transition-all hover:shadow-2xl">
                                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                        <Calendar className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <p className="text-xl text-gray-600 dark:text-gray-400 font-semibold mb-2">No GK data found for this period</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-500">Try selecting a different date, month, or year</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {gkData.map((point, index) => (
                                        <div 
                                            key={point.id || index}
                                            className="group bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-700 relative overflow-hidden backdrop-blur-sm transform hover:-translate-y-2 hover:scale-[1.02]"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-xl"></div>
                                            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-l-2xl"></div>
                                            
                                            <div className="flex items-start justify-between relative z-10">
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                                        <span className="text-xs font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                                                            {point.date}
                                                        </span>
                                                        <span className={`text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all hover:scale-110 ${
                                                            point.priority === 'High' 
                                                                ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-700 dark:from-red-900/40 dark:to-red-800/40 dark:text-red-300 border border-red-300 dark:border-red-700' 
                                                                : point.priority === 'Medium'
                                                                ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 dark:from-yellow-900/40 dark:to-yellow-800/40 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700'
                                                                : 'bg-gradient-to-r from-green-100 to-green-200 text-green-700 dark:from-green-900/40 dark:to-green-800/40 dark:text-green-300 border border-green-300 dark:border-green-700'
                                                        }`}>
                                                            {point.priority} Priority
                                                        </span>
                                                        <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 dark:from-blue-900/40 dark:to-indigo-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-700 shadow-sm transition-all hover:scale-110">
                                                            {point.category}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-lg font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                        {point.content}
                                                    </p>
                                                </div>

                                                 
                                    {/* Bookmark / Lock */}
                                        {Number.isInteger(point.id) ? (
                                            <button
                                                onClick={() => toggleBookmark(point.id, point.isBookmarked)}
                                                className={`p-2 rounded-full transition ${
                                                    point.isBookmarked
                                                        ? 'text-blue-600'
                                                        : 'text-gray-400 hover:text-blue-500'
                                                }`}
                                                title="Bookmark GK"
                                            >
                                                {point.isBookmarked ? (
                                                    <BookmarkCheck size={18} />
                                                ) : (
                                                    <Bookmark size={18} />
                                                )}
                                            </button>
                                        ) : (
                                            <span
                                                className="p-2 text-gray-300 cursor-not-allowed"
                                                title="Bookmark available only for saved GK"
                                            >
                                                🔒
                                            </span>
                                        )}





                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out;
                }
            `}</style>
        </div>
    );
};

export default RevisionHub;