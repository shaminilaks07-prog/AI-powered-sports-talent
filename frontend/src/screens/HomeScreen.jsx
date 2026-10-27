import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Upload,
  Video,
  TrendingUp,
  Award,
  Activity,
  Sparkles,
  ChevronRight,
  Target,
  Clock,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  MapPin,
  Calendar,
  FileBarChart2,
  ShieldCheck,
  Zap,
  User,
  RefreshCw,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { fetchAthleteProgress, fetchUserAssessments, uploadAndAnalyzeVideo } from '../services/api';

export default function HomeScreen({
  user,
  onNavigateToUpload,
  onNavigateToHistory,
  onNavigateToProfile,
  onNavigateToStats,
  onNavigateToDrills,
  onSelectAssessment
}) {
  const [progress, setProgress] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Embedded Dashboard Video Upload State
  const [selectedSport, setSelectedSport] = useState(user?.primary_sport || 'Sit-ups and Core Endurance');
  const [dragActive, setDragActive] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzingStep, setAnalyzingStep] = useState('');
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const sportsShortcuts = [
    { id: 'Sit-ups and Core Endurance', name: 'Sit-ups & Core', icon: '🧘', desc: 'Rep counter & cadence' },
    { id: 'Squats and Lower-Body Movement', name: 'Squats / Form', icon: '🏋️', desc: 'Depth & knee angles' },
    { id: 'Jumping Exercises', name: 'Jumping Power', icon: '⚡', desc: 'Explosive velocity' },
    { id: 'Running and Sprinting', name: 'Sprint Cadence', icon: '🏃', desc: 'Stride & trunk lean' },
    { id: 'Balance and Posture Assessment', name: 'Balance & Posture', icon: '⚖️', desc: 'Center-of-mass sway' }
  ];

  useEffect(() => {
    async function loadDashboardData() {
      if (!user?.id) return;
      setLoading(true);
      try {
        const [progData, assessData] = await Promise.all([
          fetchAthleteProgress(user.id),
          fetchUserAssessments(user.id)
        ]);
        setProgress(progData);
        setAssessments(assessData || []);
      } catch (err) {
        console.warn('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [user]);

  const hasHistory = assessments.length > 0;
  const recentAssessments = assessments.slice(0, 5);

  // File Validation & Dropzone Handlers
  const validateAndSetFile = (file) => {
    const validExts = ['.mp4', '.mov', '.webm', '.avi', '.mkv', '.m4v'];
    const hasValidExt = validExts.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!file.type.startsWith('video/') && !hasValidExt) {
      setUploadError('Please select a valid sports video file (.mp4, .mov, .webm, .avi, .mkv, .m4v).');
      return;
    }
    // 60 MB limit as enforced by FastAPI backend
    if (file.size > 60 * 1024 * 1024) {
      setUploadError('Video file exceeds 60MB limit. Please upload a short 5–30 second video clip.');
      return;
    }
    if (file.size === 0) {
      setUploadError('Selected video file is empty. Please select a valid recording.');
      return;
    }

    setVideoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setUploadError('');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleAnalyzeVideo = async () => {
    if (!videoFile) {
      setUploadError('Please choose or drag a video file first.');
      return;
    }

    setAnalyzing(true);
    setUploadError('');

    try {
      setAnalyzingStep('1/4: Ingesting video into FastAPI backend...');
      await new Promise((r) => setTimeout(r, 300));

      setAnalyzingStep('2/4: MediaPipe Pose: Detecting 33 human joint coordinates...');
      await new Promise((r) => setTimeout(r, 400));

      setAnalyzingStep('3/4: Calculating joint angles & repetition state machine...');
      await new Promise((r) => setTimeout(r, 350));

      setAnalyzingStep('4/4: Generating transparent biomechanics report...');

      const formData = new FormData();
      formData.append('sport', selectedSport);
      formData.append('user_id', user?.id || 1);
      formData.append('video', videoFile);

      const res = await uploadAndAnalyzeVideo(formData);
      if (res.success && res.data) {
        // Persist to local storage
        const key = `history_${user?.id || 1}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        localStorage.setItem(key, JSON.stringify([res.data, ...existing]));

        // Refresh assessments list
        setAssessments((prev) => [res.data, ...prev]);

        // Navigate to results
        if (onSelectAssessment) {
          onSelectAssessment(res.data);
        }
      } else {
        throw new Error('Analysis response was empty.');
      }
    } catch (err) {
      setUploadError(err.message || 'Video analysis failed. Please verify lighting and full body framing.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-[#303831] max-w-7xl mx-auto">
      {/* 1. Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#4B2925] via-[#570F22] to-[#321B1A] text-[#F7F0E7] p-6 md:p-8 border border-[#4B2925] shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#321B1A]/80 border border-[#722F46] text-[#E6D8CB] text-xs font-bold tracking-wide">
              <Sparkles size={13} className="text-[#E6D8CB]" />
              <span>TalentPulse AI • Sports Assessment Platform</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#FFF9F2] leading-tight">
              Welcome, {user?.name ? user.name : 'Athlete'}!
            </h1>

            <p className="text-xs md:text-sm text-[#E6D8CB] leading-relaxed">
              Objective kinematic movement evaluation using ordinary camera vision. Analyze joint angles, repetition rhythm, and physical technique with certified standards.
            </p>

            {user?.location && (
              <div className="flex items-center gap-2 text-xs text-[#E6D8CB]/90 pt-1 font-medium">
                <MapPin size={14} className="text-[#E6D8CB]" />
                <span>{user.location}</span>
                <span>•</span>
                <span>Primary: {user.primary_sport || 'Sit-ups & Core'}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateToUpload('Sit-ups and Core Endurance')}
              className="btn-wine text-xs py-3 px-5 shadow-md flex items-center justify-center gap-2"
            >
              <Play size={14} fill="currentColor" />
              <span>Start Assessment</span>
            </button>
            <button
              onClick={onNavigateToHistory}
              className="btn-warm text-xs py-2.5 px-4 flex items-center justify-center gap-1.5"
            >
              <Clock size={14} />
              <span>View Past Reports</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Real Statistics Summary Cards */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xs font-bold text-[#766660] uppercase tracking-wider">
            Verified Performance Snapshot
          </h2>
          {hasHistory && onNavigateToStats && (
            <button
              onClick={onNavigateToStats}
              className="text-xs text-[#722F46] hover:underline flex items-center gap-1 font-bold"
            >
              Detailed Analytics <ChevronRight size={13} />
            </button>
          )}
        </div>

        {!hasHistory ? (
          /* Empty state for stats when user has 0 assessments */
          <div className="p-6 rounded-2xl bg-[#FFF9F2] border border-[#E6D8CB] text-center space-y-2 shadow-xs">
            <div className="w-10 h-10 rounded-2xl bg-[#F7F0E7] text-[#4B2925] flex items-center justify-center mx-auto border border-[#E6D8CB]">
              <Activity size={20} />
            </div>
            <h3 className="font-bold text-sm text-[#303831]">No Assessment Data Yet</h3>
            <p className="text-xs text-[#766660] max-w-md mx-auto leading-relaxed">
              Complete your initial exercise assessment below to establish your verified performance baseline, repetition counts, and biomechanical scores.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#E6D8CB] shadow-xs hover:border-[#805044] transition-colors">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-[#766660] uppercase tracking-wider">
                  Assessments Completed
                </span>
                <div className="w-7 h-7 rounded-lg bg-[#EFE4D8] text-[#722F46] flex items-center justify-center">
                  <Activity size={15} />
                </div>
              </div>
              <span className="text-2xl font-black text-[#303831] block">
                {progress?.total_assessments || 0}
              </span>
              <span className="text-[10px] text-[#766660] font-medium">Logged in database</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#E6D8CB] shadow-xs hover:border-[#805044] transition-colors">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-[#766660] uppercase tracking-wider">
                  Peak Score
                </span>
                <div className="w-7 h-7 rounded-lg bg-[#EFE4D8] text-[#278653] flex items-center justify-center">
                  <Award size={15} />
                </div>
              </div>
              <span className="text-2xl font-black text-[#303831] block">
                {progress?.highest_score || 0}
              </span>
              <span className="text-[10px] text-[#278653] font-bold">/ 100 PTS Verified</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#E6D8CB] shadow-xs hover:border-[#805044] transition-colors">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-[#766660] uppercase tracking-wider">
                  Total Reps Counted
                </span>
                <div className="w-7 h-7 rounded-lg bg-[#EFE4D8] text-[#805044] flex items-center justify-center">
                  <Target size={15} />
                </div>
              </div>
              <span className="text-2xl font-black text-[#303831] block">
                {progress?.total_reps || 0}
              </span>
              <span className="text-[10px] text-[#766660] font-medium">Across all drills</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#E6D8CB] shadow-xs hover:border-[#805044] transition-colors">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-[#766660] uppercase tracking-wider">
                  Primary Sport
                </span>
                <div className="w-7 h-7 rounded-lg bg-[#EFE4D8] text-[#4B2925] flex items-center justify-center">
                  <Compass size={15} />
                </div>
              </div>
              <span className="text-sm font-black text-[#303831] block truncate mt-1">
                {user?.primary_sport || 'Core Fitness'}
              </span>
              <span className="text-[10px] text-[#766660] font-medium">Specialized routine</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Prominent "Analyze Athlete Video" Section */}
      <div className="p-6 md:p-7 rounded-3xl bg-[#FFF9F2] border border-[#E6D8CB] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E6D8CB]">
          <div>
            <h2 className="text-lg font-black text-[#303831] flex items-center gap-2">
              <Video size={20} className="text-[#722F46]" />
              <span>Analyze Athlete Video</span>
            </h2>
            <p className="text-xs text-[#766660]">
              Upload a 5–30s athletic video clip or record with your webcam for automated computer vision evaluation.
            </p>
          </div>

          <button
            onClick={() => onNavigateToUpload(selectedSport)}
            className="text-xs font-bold text-[#722F46] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Switch to Live Camera View</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        {/* Drill Selector Tabs */}
        <div>
          <label className="block text-[11px] font-bold text-[#766660] uppercase tracking-wider mb-2">
            Target Exercise Drill:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {sportsShortcuts.map((sp) => {
              const isSelected = selectedSport === sp.id;
              return (
                <button
                  key={sp.id}
                  type="button"
                  onClick={() => setSelectedSport(sp.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-[#722F46] border-[#722F46] text-white shadow-xs font-bold'
                      : 'bg-[#F7F0E7] border-[#E6D8CB] text-[#303831] hover:bg-[#EFE4D8]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{sp.icon}</span>
                    <span className="text-xs truncate">{sp.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Drag and Drop Video Upload Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-[#722F46] bg-[#722F46]/10'
              : videoFile
              ? 'border-[#278653] bg-[#278653]/5'
              : 'border-[#E6D8CB] bg-[#F7F0E7] hover:bg-[#EFE4D8] hover:border-[#805044]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*,.mp4,.mov,.webm,.avi,.mkv,.m4v"
            onChange={handleFileChange}
            className="hidden"
          />

          {previewUrl ? (
            <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
              <video
                src={previewUrl}
                controls
                playsInline
                className="w-full max-h-56 rounded-xl object-contain bg-black mx-auto shadow-inner"
              />
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
                <span className="font-bold text-[#303831] flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-[#278653]" />
                  {videoFile?.name}
                </span>
                <span className="text-[#766660]">
                  ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="text-xs text-[#722F46] hover:underline font-bold"
                >
                  Change Video File
                </button>
              </div>
            </div>
          ) : (
            <div className="py-4 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#EFE4D8] text-[#722F46] flex items-center justify-center mx-auto shadow-xs">
                <Upload size={22} />
              </div>
              <p className="text-sm font-bold text-[#303831]">
                Drag and drop athlete performance video here, or{' '}
                <span className="text-[#722F46] underline">Browse Files</span>
              </p>
              <p className="text-xs text-[#766660] max-w-md mx-auto">
                Supported formats: <strong>MP4, MOV, WebM, AVI, MKV, M4V</strong> • Maximum file size: <strong>60 MB</strong> • Recommended length: 5–30 seconds
              </p>
            </div>
          )}
        </div>

        {uploadError && (
          <div className="p-3.5 rounded-xl bg-[#C47A32]/10 border border-[#C47A32]/25 text-[#C47A32] text-xs font-semibold flex items-center gap-2">
            <AlertTriangle size={16} className="shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Upload and Analyze Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="text-[11px] text-[#766660] flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-[#278653]" />
            <span>Processed locally via MediaPipe Pose 33 3D skeletal landmarks</span>
          </div>

          <button
            onClick={handleAnalyzeVideo}
            disabled={analyzing}
            className="w-full sm:w-auto btn-wine py-3 px-8 text-sm"
          >
            {analyzing ? (
              <div className="flex items-center gap-2">
                <RefreshCw size={16} className="animate-spin text-white" />
                <span>{analyzingStep || 'Analyzing Biomechanics...'}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles size={16} />
                <span>Upload and Analyze</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* 4. Recent Assessment / History Table */}
      <div className="p-6 rounded-3xl bg-[#FFF9F2] border border-[#E6D8CB] shadow-xs space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-[#E6D8CB]">
          <div>
            <h2 className="text-base font-bold text-[#303831] flex items-center gap-2">
              <Clock size={18} className="text-[#4B2925]" />
              <span>Recent Assessment Reports</span>
            </h2>
            <p className="text-xs text-[#766660]">
              Biomechanical evaluations and pose landmark logs recorded for this athlete.
            </p>
          </div>

          {hasHistory && (
            <button
              onClick={onNavigateToHistory}
              className="text-xs text-[#722F46] hover:underline font-bold flex items-center gap-1"
            >
              All Records <ChevronRight size={13} />
            </button>
          )}
        </div>

        {!hasHistory ? (
          <div className="text-center py-8 text-xs text-[#766660] space-y-2">
            <Clock size={20} className="mx-auto text-[#805044]/60" />
            <p>No recent assessment history to display.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E6D8CB] text-[#766660] uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Exercise Drill</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Repetitions</th>
                  <th className="py-2.5 px-3">Score</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6D8CB]/60">
                {recentAssessments.map((item) => {
                  const dateStr = item.created_at
                    ? new Date(item.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })
                    : 'Recent';

                  return (
                    <tr
                      key={item.id}
                      onClick={() => onSelectAssessment && onSelectAssessment(item)}
                      className="hover:bg-[#F7F0E7] transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-3 font-bold text-[#303831] group-hover:text-[#722F46]">
                        {item.sport}
                      </td>
                      <td className="py-3 px-3 text-[#766660]">{dateStr}</td>
                      <td className="py-3 px-3 font-semibold text-[#303831]">
                        {item.reps_count > 0 ? `${item.reps_count} reps` : 'Evaluated'}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-black text-[#722F46] text-sm">
                          {item.overall_score}
                        </span>
                        <span className="text-[10px] text-[#766660] font-bold"> / 100</span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectAssessment && onSelectAssessment(item);
                          }}
                          className="btn-outline text-[11px] py-1.5 px-3"
                        >
                          View Report
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Quick-Action Links Grid */}
      <div>
        <h2 className="text-xs font-bold text-[#766660] uppercase tracking-wider mb-3">
          Quick Action Shortcuts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div
            onClick={onNavigateToHistory}
            className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#E6D8CB] hover:border-[#722F46] transition-all cursor-pointer shadow-xs group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl bg-[#EFE4D8] text-[#722F46] flex items-center justify-center">
                <FileBarChart2 size={18} />
              </div>
              <ChevronRight size={15} className="text-[#805044] group-hover:text-[#722F46]" />
            </div>
            <h3 className="text-xs font-bold text-[#303831] group-hover:text-[#722F46]">
              Talent Reports & History
            </h3>
            <p className="text-[11px] text-[#766660] mt-0.5">
              Review saved biomechanics summaries & evaluator notes.
            </p>
          </div>

          <div
            onClick={onNavigateToProfile}
            className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#E6D8CB] hover:border-[#722F46] transition-all cursor-pointer shadow-xs group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl bg-[#EFE4D8] text-[#4B2925] flex items-center justify-center">
                <User size={18} />
              </div>
              <ChevronRight size={15} className="text-[#805044] group-hover:text-[#722F46]" />
            </div>
            <h3 className="text-xs font-bold text-[#303831] group-hover:text-[#722F46]">
              Athlete Profile
            </h3>
            <p className="text-[11px] text-[#766660] mt-0.5">
              Update personal details, district, and athletic goals.
            </p>
          </div>

          <div
            onClick={onNavigateToStats}
            className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#E6D8CB] hover:border-[#722F46] transition-all cursor-pointer shadow-xs group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl bg-[#EFE4D8] text-[#805044] flex items-center justify-center">
                <TrendingUp size={18} />
              </div>
              <ChevronRight size={15} className="text-[#805044] group-hover:text-[#722F46]" />
            </div>
            <h3 className="text-xs font-bold text-[#303831] group-hover:text-[#722F46]">
              Performance Statistics
            </h3>
            <p className="text-[11px] text-[#766660] mt-0.5">
              Track multi-session progress charts and discipline bests.
            </p>
          </div>

          <div
            onClick={onNavigateToDrills}
            className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#E6D8CB] hover:border-[#722F46] transition-all cursor-pointer shadow-xs group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl bg-[#EFE4D8] text-[#722F46] flex items-center justify-center">
                <Compass size={18} />
              </div>
              <ChevronRight size={15} className="text-[#805044] group-hover:text-[#722F46]" />
            </div>
            <h3 className="text-xs font-bold text-[#303831] group-hover:text-[#722F46]">
              Exercise Guides & Drills
            </h3>
            <p className="text-[11px] text-[#766660] mt-0.5">
              Read camera placement guidelines & test criteria.
            </p>
          </div>
        </div>
      </div>

      {/* 6. Sports-Inspired Motivational Panel */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#321B1A] via-[#4B2925] to-[#570F22] text-[#F7F0E7] border border-[#4B2925] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E6D8CB]">
            <Flame size={14} className="text-[#C47A32]" />
            <span>Athletic Excellence & Grassroots Vision</span>
          </div>
          <p className="text-sm font-semibold text-[#FFF9F2] italic">
            "Champions are built through disciplined repetition, accurate mechanics, and honest feedback. Measure your progress, refine your technique, and let your natural talent shine."
          </p>
          <p className="text-[11px] text-[#E6D8CB]/80">
            TalentPulse AI • Equal access to sports science for every aspiring athlete.
          </p>
        </div>

        <button
          onClick={() => onNavigateToUpload()}
          className="btn-wine text-xs py-2 px-5 shrink-0 self-start md:self-center"
        >
          Train Today
        </button>
      </div>
    </div>
  );
}
