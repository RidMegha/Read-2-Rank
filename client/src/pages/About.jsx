import React from 'react';
import { CheckCircle, Award, Zap, Globe, Sparkles, BookOpen, TrendingUp } from 'lucide-react';

const About = () => {
    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-12">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 dark:from-blue-800 dark:via-indigo-900 dark:to-purple-900 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 group">
                {/* Animated background elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 -left-4 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 -right-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-500"></div>
                </div>
                
                {/* Pattern overlay */}
                <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                
                {/* Decorative circles */}
                <div className="absolute top-8 right-8 w-32 h-32 border-4 border-white/20 rounded-full group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute bottom-8 left-8 w-24 h-24 border-4 border-white/20 rounded-full group-hover:scale-110 transition-transform duration-700 delay-100"></div>
                
                <div className="relative z-10 px-6 py-16 md:py-20 text-center space-y-6">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
                        <Sparkles className="w-4 h-4" />
                        Your Success Partner
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-2xl">
                        Master Current Affairs
                    </h1>
                    <p className="text-lg md:text-xl lg:text-2xl text-blue-100 dark:text-blue-200 max-w-4xl mx-auto leading-relaxed font-medium">
                        Read-2-Rank is your intelligent companion for UPSC, SSC, and Banking exams. We distill the noise into knowledge.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 pt-6">
                        <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-bold shadow-lg">
                            📚 UPSC
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-bold shadow-lg">
                            💼 SSC
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-bold shadow-lg">
                            🏦 Banking
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="relative overflow-hidden bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-950 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-blue-100 dark:border-blue-900 group hover:-translate-y-2 cursor-pointer">
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-blue-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    <div className="relative z-10">
                        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                            <Globe className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            Global & Indian Coverage
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            We fetch news daily from trusted sources worldwide, categorizing them into Indian and Global buckets so you never miss a headline.
                        </p>
                    </div>
                    
                    {/* Corner decoration */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-bl-[100px] group-hover:scale-150 transition-transform duration-500"></div>
                </div>

                <div className="relative overflow-hidden bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-950 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-purple-100 dark:border-purple-900 group hover:-translate-y-2 cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-purple-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    <div className="relative z-10">
                        <div className="bg-gradient-to-br from-purple-500 to-pink-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                            <Zap className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            Smart GK Extraction
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Our algorithm scans thousands of articles to extract exam-relevant facts, dates, and appointments, saving you hours of reading time.
                        </p>
                    </div>
                    
                    <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-bl-[100px] group-hover:scale-150 transition-transform duration-500"></div>
                </div>

                <div className="relative overflow-hidden bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-950 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-green-100 dark:border-green-900 group hover:-translate-y-2 cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-green-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    <div className="relative z-10">
                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                            <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                            Revision Hub
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Spaced repetition is key. Use our Revision Hub to access daily, monthly, and yearly compilations of GK points.
                        </p>
                    </div>
                    
                    <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/5 rounded-bl-[100px] group-hover:scale-150 transition-transform duration-500"></div>
                </div>

                <div className="relative overflow-hidden bg-gradient-to-br from-white to-yellow-50 dark:from-gray-800 dark:to-yellow-950 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-yellow-100 dark:border-yellow-900 group hover:-translate-y-2 cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-yellow-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    <div className="relative z-10">
                        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                            <Award className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                            Personalized Journey
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Create an account to bookmark important facts, track your progress, and customize your feed based on your target exam (UPSC, SSC, Banking).
                        </p>
                    </div>
                    
                    <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/5 rounded-bl-[100px] group-hover:scale-150 transition-transform duration-500"></div>
                </div>
            </div>

            {/* Why Read-2-Rank Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-white via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-indigo-950 dark:to-purple-950 rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-indigo-100 dark:border-indigo-900 hover:shadow-3xl transition-all duration-500 group">
                {/* Decorative gradient top border */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-3xl"></div>
                
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/5 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                            <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                            Why Read-2-Rank?
                        </h2>
                    </div>
                    
                    <div className="space-y-6 text-gray-700 dark:text-gray-300">
                        <p className="text-lg leading-relaxed">
                            In the fast-paced world of competitive exams, staying updated is crucial but time-consuming. Traditional newspapers are cluttered, and generic news apps are distracting.
                        </p>
                        <p className="text-lg leading-relaxed">
                            Read-2-Rank bridges this gap. We are built by engineers and aspirants who understand the value of concise, relevant information. Our platform is designed to be your:
                        </p>
                        
                        <div className="grid md:grid-cols-3 gap-6 py-6">
                            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group/card">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md group-hover/card:scale-110 transition-transform">
                                        <TrendingUp className="w-5 h-5 text-white" />
                                    </div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">Daily News Aggregator</h4>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">No need to visit 10 different sites.</p>
                            </div>
                            
                            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border-2 border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group/card">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md group-hover/card:scale-110 transition-transform">
                                        <CheckCircle className="w-5 h-5 text-white" />
                                    </div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">Fact Checker</h4>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">We prioritize credible sources.</p>
                            </div>
                            
                            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group/card">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md group-hover/card:scale-110 transition-transform">
                                        <BookOpen className="w-5 h-5 text-white" />
                                    </div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">Digital Notebook</h4>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Bookmark what matters.</p>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 rounded-2xl p-8 text-white mt-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                            <p className="text-xl md:text-2xl font-bold text-center">
                                Join thousands of aspirants who are studying smarter, not harder. 🚀
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;