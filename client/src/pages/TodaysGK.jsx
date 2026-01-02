import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Bookmark, BookmarkCheck, Share2, Download, Printer, Sparkles, Calendar, TrendingUp } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const TodaysGK = () => {
    const { user } = useAuth();
    const [gkPoints, setGkPoints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGK = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get('http://localhost:5000/api/gk/today', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setGkPoints(res.data);

                // ✅ Log GK View Activity
                if (user && token) {
                    await axios.post(
                        'http://localhost:5000/api/activity',
                        { type: 'GK_VIEW' },
                        { headers: { Authorization: `Bearer ${token}` } }
                    ).catch(err => console.error('Activity log failed:', err));
                }
            } catch (error) {
                console.error("Error fetching GK", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGK();
    }, [user]);

    const toggleBookmark = async (id, isBookmarked) => {
        const token = localStorage.getItem('token');

        try {
            if (isBookmarked) {
                await axios.delete(`http://localhost:5000/api/gk/bookmark/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(
                    'http://localhost:5000/api/gk/bookmark',
                    { gk_id: id },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                // ✅ Log Bookmark Activity
                await axios.post(
                    'http://localhost:5000/api/activity',
                    { type: 'BOOKMARK', gk_id: id },
                    { headers: { Authorization: `Bearer ${token}` } }
                ).catch(err => console.error('Activity log failed:', err));
            }

            setGkPoints(prev =>
                prev.map(point =>
                    point.id === id
                        ? { ...point, isBookmarked: !isBookmarked }
                        : point
                )
            );
        } catch (error) {
            console.error("Error updating bookmark", error);
        }
    };

    const exportPDF = () => {
        try {
            const doc = new jsPDF();
            doc.text("Read-2-Rank - Today's GK Points", 14, 15);
            doc.setFontSize(10);
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 22);

            const tableData = gkPoints.map(p => [p.category, p.priority, p.content]);

            autoTable(doc, {
                startY: 25,
                head: [['Category', 'Priority', 'Content']],
                body: tableData,
                theme: 'grid',
                headStyles: { fillColor: [30, 64, 175] },
            });

            /* ✅ ADD PAGE NUMBERS HERE */
            const pageCount = doc.internal.getNumberOfPages();

            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(9);
                doc.text(
                    `Page ${i} of ${pageCount}`,
                    doc.internal.pageSize.getWidth() - 20,
                    doc.internal.pageSize.getHeight() - 10,
                    { align: 'right' }
                );
            }

            doc.save(`Read-2-Rank_Today_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (err) {
            console.error("PDF Export failed:", err);
            alert("Failed to export PDF. Please check console for details.");
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) return (
        <div className="flex justify-center items-center h-[60vh]">
            <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 dark:border-blue-400"></div>
                <div className="animate-ping absolute inset-0 rounded-full h-16 w-16 border-4 border-blue-400 dark:border-blue-300 opacity-20"></div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 print-root pb-12">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 dark:from-blue-800 dark:via-indigo-900 dark:to-purple-900 rounded-3xl p-8 shadow-2xl">
                {/* Animated background */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
                    <div className="text-center md:text-left">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg text-white">
                            <Sparkles className="w-4 h-4" />
                            Daily Knowledge Update
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 drop-shadow-lg">
                            Today's GK Points
                        </h1>
                        <div className="flex items-center justify-center md:justify-start gap-2 text-blue-100">
                            <Calendar className="w-5 h-5" />
                            <span className="text-lg font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 print:hidden">
                        <button 
                            onClick={exportPDF}
                            className="group relative overflow-hidden flex items-center space-x-2 bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-300 px-6 py-3 rounded-xl hover:shadow-xl transition-all duration-300 font-semibold hover:-translate-y-1"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                            <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span>Export PDF</span>
                        </button>
                        <button 
                            onClick={handlePrint}
                            className="group relative overflow-hidden flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300 font-semibold hover:-translate-y-1 hover:shadow-xl"
                        >
                            <Printer className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span>Print</span>
                        </button>
                    </div>
                </div>

                {/* Stats bar */}
                <div className="relative z-10 mt-6 flex flex-wrap items-center gap-4">
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-white font-semibold shadow-lg">
                        <span className="text-2xl font-bold">{gkPoints.length}</span>
                        <span className="text-sm ml-2 opacity-90">Total Points</span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-white font-semibold shadow-lg">
                        <span className="text-2xl font-bold">{gkPoints.filter(p => p.isBookmarked).length}</span>
                        <span className="text-sm ml-2 opacity-90">Bookmarked</span>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="grid gap-5 print:block print-area">
                {/* 🖨️ Print-only heading */}
                <h2 className="hidden print:block text-2xl font-bold mb-6 text-center">
                    Daily Current Affairs – {new Date().toLocaleDateString()}
                </h2>

                {gkPoints.length === 0 ? (
                    <div className="relative overflow-hidden text-center py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-950 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                        <div className="relative z-10">
                            <div className="inline-block mb-6">
                                <div className="relative">
                                    <TrendingUp className="w-20 h-20 text-gray-300 dark:text-gray-600 animate-pulse" />
                                    <div className="absolute inset-0 animate-ping opacity-20">
                                        <TrendingUp className="w-20 h-20 text-gray-300 dark:text-gray-600" />
                                    </div>
                                </div>
                            </div>
                            <p className="text-xl font-semibold text-gray-500 dark:text-gray-400">No GK points extracted yet for today.</p>
                            <p className="text-gray-400 dark:text-gray-500 mt-2">Check back later for updates!</p>
                        </div>
                    </div>
                ) : (
                    gkPoints.map((point, index) => (
                        <div 
                            key={point.id}
                            className={`group relative overflow-hidden p-6 bg-gradient-to-br ${
                                point.priority === 'High' 
                                    ? 'from-white to-red-50 dark:from-gray-800 dark:to-red-950/30' 
                                    : point.priority === 'Medium' 
                                    ? 'from-white to-yellow-50 dark:from-gray-800 dark:to-yellow-950/30' 
                                    : 'from-white to-green-50 dark:from-gray-800 dark:to-green-950/30'
                            } rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 ${
                                point.priority === 'High' 
                                    ? 'border-red-200 dark:border-red-900/50 hover:border-red-400 dark:hover:border-red-700' 
                                    : point.priority === 'Medium' 
                                    ? 'border-yellow-200 dark:border-yellow-900/50 hover:border-yellow-400 dark:hover:border-yellow-700' 
                                    : 'border-green-200 dark:border-green-900/50 hover:border-green-400 dark:hover:border-green-700'
                            } hover:-translate-y-1 print:break-inside-avoid print:mb-4`}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                            {/* Priority indicator bar */}
                            <div className={`absolute left-0 top-0 bottom-0 w-2 rounded-l-2xl ${
                                point.priority === 'High' 
                                    ? 'bg-gradient-to-b from-red-500 to-red-600' 
                                    : point.priority === 'Medium' 
                                    ? 'bg-gradient-to-b from-yellow-500 to-amber-600' 
                                    : 'bg-gradient-to-b from-green-500 to-emerald-600'
                            }`}></div>

                            <div className="relative z-10 flex justify-between items-start pl-3">
                                <div className="flex-grow pr-4">
                                    <div className="flex items-center flex-wrap gap-2 mb-4">
                                        {/* Priority Badge */}
                                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full shadow-md transition-all duration-300 group-hover:scale-105 ${
                                            point.priority === 'High' 
                                                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' 
                                                : point.priority === 'Medium' 
                                                ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white' 
                                                : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                                        }`}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                                            {point.priority}
                                        </span>

                                        {/* Category Badge */}
                                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 px-3 py-1.5 rounded-full shadow-sm">
                                            {point.category}
                                        </span>

                                        {/* Index Badge */}
                                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2.5 py-1 rounded-full">
                                            #{index + 1}
                                        </span>
                                    </div>

                                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-lg font-medium">
                                        {point.content}
                                    </p>
                                </div>

                                {/* Bookmark Button */}
                                <div className="flex flex-col space-y-2 print:hidden">
                                    <button 
                                        onClick={() => toggleBookmark(point.id, point.isBookmarked)}
                                        className={`relative p-3 rounded-xl transition-all duration-300 group/btn ${
                                            point.isBookmarked 
                                                ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg scale-110' 
                                                : 'bg-white dark:bg-gray-700 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-600 shadow-md hover:shadow-lg hover:scale-110'
                                        }`}
                                        title={point.isBookmarked ? "Remove bookmark" : "Add bookmark"}
                                    >
                                        {point.isBookmarked ? (
                                            <BookmarkCheck className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                                        ) : (
                                            <Bookmark className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                                        )}
                                        
                                        {/* Ripple effect on bookmark */}
                                        {point.isBookmarked && (
                                            <span className="absolute inset-0 rounded-xl bg-blue-400 animate-ping opacity-20"></span>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Corner decoration */}
                            <div className={`absolute bottom-0 right-0 w-24 h-24 opacity-5 rounded-tl-[100px] ${
                                point.priority === 'High' 
                                    ? 'bg-red-500' 
                                    : point.priority === 'Medium' 
                                    ? 'bg-yellow-500' 
                                    : 'bg-green-500'
                            } group-hover:scale-150 transition-transform duration-500`}></div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer Summary */}
            {gkPoints.length > 0 && (
                <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-800 dark:to-purple-800 rounded-2xl p-6 shadow-xl print:hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10 text-center text-white">
                        <p className="text-lg font-semibold">
                            🎯 You've reviewed <span className="text-2xl font-bold">{gkPoints.length}</span> GK points today!
                        </p>
                        <p className="text-sm text-indigo-200 mt-1">Keep up the great work and stay consistent! 💪</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TodaysGK;