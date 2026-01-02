import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { ArrowLeft, ExternalLink, Clock, Calendar, ChevronUp, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';

const NewsReader = () => {
  const [searchParams] = useSearchParams();
  const url = searchParams.get('url');
  const navigate = useNavigate();

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const isMounted = useRef(true);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      setError('No article URL provided');
      return;
    }

    const controller = new AbortController();
    let progressInterval;

    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);
        setProgress(0);
        
        // Simulate progress for better UX
        progressInterval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 90) return prev;
            return prev + Math.random() * 10;
          });
        }, 300);

        console.log('🔍 Starting fetch for:', url);
        
        const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
       const response = await axios.get(`${API_BASE}/api/news/fetch-content`, {
          params: { url },
          timeout: 30000, // 30 seconds
          signal: controller.signal,
          validateStatus: (status) => status < 500
        });

        clearInterval(progressInterval);
        setProgress(100);

        console.log('📦 Response:', response.data);

        if (!isMounted.current) return;

        if (response.data && response.data.success && response.data.article) {
          console.log('✅ Success - Article loaded');
          setContent(response.data.article);
          setError(null);
        } else {
          console.log('⚠️ Failed:', response.data?.message);
          setError(response.data?.message || 'Could not load article content');
          setContent(null);
        }
      } catch (err) {
        clearInterval(progressInterval);
        
        if (!isMounted.current) return;
        
        if (axios.isCancel(err)) {
          console.log('🚫 Request canceled');
          return;
        }

        console.error('❌ Fetch error:', err);

        let errorMessage = 'Failed to load article';
        
        if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
          errorMessage = 'The article is taking too long to load. The website may be slow or blocking our request.';
        } else if (err.response?.status === 404) {
          errorMessage = 'Article not found. The link may be broken or the article has been removed.';
        } else if (err.response?.status >= 500) {
          errorMessage = 'The source website is experiencing issues. Please try again later.';
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (!navigator.onLine) {
          errorMessage = 'No internet connection. Please check your network and try again.';
        } else {
          errorMessage = 'Unable to access this article. The site may be blocking automated access or requires login.';
        }

        setError(errorMessage);
        setContent(null);
      } finally {
        clearInterval(progressInterval);
        if (isMounted.current) {
          setLoading(false);
          setProgress(0);
        }
      }
    };

    // Small delay to prevent flash of loading state
    const timeoutId = setTimeout(() => {
      if (isMounted.current) {
        fetchContent();
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(progressInterval);
      controller.abort();
    };
  }, [url]);

  // Early return for no URL
  if (!url) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 mb-4 text-lg font-medium">No article URL provided</p>
          <button 
            onClick={() => navigate(-1)} 
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#030712] transition-colors duration-500">
      {/* Dynamic Progress Bar */}
      {loading && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800 z-50">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}
      
      {!loading && <motion.div className="fixed top-0 left-0 right-0 h-1 bg-blue-500 z-50 origin-left" style={{ scaleX }} />}

      <div className="container mx-auto px-4 lg:px-8 max-w-4xl pt-10 pb-20">
        
        {/* Styled Back Button */}
        <motion.button 
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 px-4 py-2 mb-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-blue-500" />
          <span className="font-bold text-sm text-slate-700 dark:text-slate-200">Back to News</span>
        </motion.button>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-[70vh] flex flex-col items-center justify-center"
            >
              <div className="relative mb-8">
                <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                <div className="absolute inset-0 blur-xl bg-blue-500/20 rounded-full animate-pulse" />
              </div>
              
              <div className="text-center space-y-3">
                <p className="text-xl font-bold text-slate-700 dark:text-slate-300">
                  Loading Article...
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
                  Fetching content from the source website. This may take a moment.
                </p>
              </div>

              {/* Helpful tips while loading */}
              <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-950/30 rounded-2xl border border-blue-100 dark:border-blue-900/50 max-w-md">
                <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                  💡 <span className="font-semibold">Tip:</span> Some sites may take longer to load or block automated access.
                </p>
              </div>
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-12 bg-white dark:bg-slate-900 rounded-3xl border border-red-100 dark:border-red-900/30 shadow-xl"
            >
              <div className="text-center max-w-2xl mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                </div>
                
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                  Unable to Load Article
                </h2>
                
                <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg leading-relaxed">
                  {error}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all shadow-sm"
                  >
                    Try Again
                  </motion.button>
                  
                  <motion.a 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20"
                  >
                    Open Original Site <ExternalLink className="w-5 h-5" />
                  </motion.a>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    <strong>Common reasons:</strong> Paywall, login required, anti-bot protection, or slow server response
                  </p>
                </div>
              </div>
            </motion.div>
          ) : content ? (
            <motion.div 
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              {/* Main Reader Card */}
              <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl dark:shadow-blue-900/5 overflow-hidden">
                
                {/* Header Section */}
                <div className="px-8 md:px-16 pt-12 pb-8 border-b border-slate-50 dark:border-slate-800/50">
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl md:text-5xl font-black text-slate-900 dark:text-slate-50 leading-tight mb-8 tracking-tight"
                  >
                    {content.title || 'Article'}
                  </motion.h1>
                  
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap items-center gap-5 text-sm font-semibold text-slate-500 dark:text-slate-400 mb-6"
                  >
                    {content.byline && (
                      <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                        {content.byline}
                      </span>
                    )}
                    {content.length && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> {Math.ceil(content.length / 1000)} min read
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" /> {new Date().toLocaleDateString()}
                    </div>
                  </motion.div>

                  <motion.a 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group"
                  >
                    <span className="underline underline-offset-4 decoration-2 decoration-blue-500/30 group-hover:decoration-blue-500">
                      {content.siteName || 'Source website'}
                    </span>
                    <ExternalLink className="w-4 h-4" />
                  </motion.a>
                </div>

                {/* Article Content */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="prose prose-slate dark:prose-invert prose-lg md:prose-xl max-w-none px-8 md:px-16 py-12
                  dark:text-slate-300 leading-relaxed
                  prose-headings:text-slate-900 dark:prose-headings:text-slate-100 prose-headings:font-bold prose-headings:tracking-tight
                  prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                  prose-img:rounded-2xl prose-img:shadow-lg
                  prose-blockquote:border-l-4 prose-blockquote:border-blue-500 dark:prose-blockquote:text-slate-400 dark:prose-blockquote:bg-slate-800/50 prose-blockquote:rounded-r-xl
                  "
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content.content || '') }}
                />

                {/* Footer Buttons */}
                <div className="px-8 md:px-16 py-10 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-slate-500 dark:text-slate-500 text-sm font-medium italic">End of article</p>
                  
                  <div className="flex gap-3">
                    <motion.button 
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all"
                    >
                      <ChevronUp className="w-4 h-4" /> Top
                    </motion.button>

                    <motion.a 
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all"
                    >
                      View Original <ExternalLink className="w-4 h-4" />
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NewsReader;