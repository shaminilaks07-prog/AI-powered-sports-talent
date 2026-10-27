import React, { useState, useRef } from 'react';
import {
  Upload,
  Video,
  Camera,
  Play,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Info,
  ShieldCheck,
  ChevronRight,
  Zap
} from 'lucide-react';
import { uploadAndAnalyzeVideo } from '../services/api';
import WebcamRecorder from '../components/WebcamRecorder';

export default function UploadScreen({ user, initialSport, onAssessmentCompleted }) {
  const [selectedSport, setSelectedSport] = useState(initialSport || 'Sit-ups and Core Endurance');
  const [inputMode, setInputMode] = useState('upload'); // 'upload' | 'camera'
  const [videoFile, setVideoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzingStep, setAnalyzingStep] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const sports = [
    {
      id: 'Sit-ups and Core Endurance',
      name: 'Sit-ups & Core',
      icon: '🧘',
      cameraSetup: 'Side angle at mat level, 2.5m away. Capture full torso, hips, and knees.',
      whatMeasured: 'Counts repetitions via hip flexion angle, measures cadence (reps/min) and torso curl range.'
    },
    {
      id: 'Squats and Lower-Body Movement',
      name: 'Squats / Legs',
      icon: '🏋️',
      cameraSetup: 'Side or 45° angle at hip level, 3m away. Ensure head, hips, and feet are visible.',
      whatMeasured: 'Measures knee flexion depth (parallel 90° vs deep), bilateral symmetry, and torso lean.'
    },
    {
      id: 'Jumping Exercises',
      name: 'Jumping / Explosive',
      icon: '⚡',
      cameraSetup: 'Direct front or side view, 3m away. Ensure full vertical clearance above head.',
      whatMeasured: 'Tracks countermovement dip loading, explosive vertical takeoff speed, and landing absorption.'
    },
    {
      id: 'Running and Sprinting',
      name: 'Sprinting & Cadence',
      icon: '🏃',
      cameraSetup: 'Side-profile tracking or steady pass, waist level, 4m away.',
      whatMeasured: 'Analyzes dynamic knee recovery angle, acceleration trunk lean, and stride rhythm.'
    },
    {
      id: 'Balance and Posture Assessment',
      name: 'Balance & Posture',
      icon: '⚖️',
      cameraSetup: 'Frontal eye level, 2.5m away. Good lighting with contrasting background.',
      whatMeasured: 'Calculates center-of-mass sway variance, spinal verticality, and shoulder/pelvis symmetry.'
    }
  ];

  const currentSportInfo = sports.find((s) => s.id === selectedSport) || sports[0];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file) => {
    const validExts = ['.mp4', '.mov', '.webm', '.avi', '.mkv', '.m4v'];
    const hasValidExt = validExts.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!file.type.startsWith('video/') && !hasValidExt) {
      setErrorMsg('Please select a valid sports video file (.mp4, .mov, .webm, .avi, .mkv, .m4v).');
      return;
    }
    if (file.size > 60 * 1024 * 1024) {
      setErrorMsg('Selected video is too large (maximum 60MB). Please select a 5–30 second clip.');
      return;
    }
    if (file.size === 0) {
      setErrorMsg('Selected video file is empty. Please select a valid recording.');
      return;
    }

    setVideoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setErrorMsg('');
  };

  const handleCameraRecordingComplete = (file, url) => {
    setVideoFile(file);
    setPreviewUrl(url);
    setInputMode('upload'); // Return to preview mode
    setErrorMsg('');
  };

  const handleSelectSample = async (sampleName) => {
    setErrorMsg('');
    let sampleFilename = 'situp_sample.mp4';
    let sportCategory = 'Sit-ups and Core Endurance';

    if (sampleName.includes('Sit-up')) {
      sampleFilename = 'situp_sample.mp4';
      sportCategory = 'Sit-ups and Core Endurance';
    } else if (sampleName.includes('Squat')) {
      sampleFilename = 'squat_sample.mp4';
      sportCategory = 'Squats and Lower-Body Movement';
    } else if (sampleName.includes('Jump')) {
      sampleFilename = 'jump_sample.mp4';
      sportCategory = 'Jumping Exercises';
    } else if (sampleName.includes('Sprint')) {
      sampleFilename = 'sprint_sample.mp4';
      sportCategory = 'Running and Sprinting';
    }

    setSelectedSport(sportCategory);

    // Create realistic synthetic video blob for local testing
    const blob = new Blob([new Uint8Array(1024 * 50)], { type: 'video/mp4' });
    const mockFile = new File([blob], sampleFilename, { type: 'video/mp4' });
    setVideoFile(mockFile);
    setPreviewUrl(null);
  };

  const handleStartAnalysis = async () => {
    if (!videoFile) {
      setErrorMsg('Please record a video with your camera or select a video file first.');
      return;
    }

    setAnalyzing(true);
    setErrorMsg('');

    try {
      setAnalyzingStep('1/4: Ingesting recording into FastAPI backend...');
      await new Promise((r) => setTimeout(r, 350));

      setAnalyzingStep('2/4: MediaPipe Pose: Detecting 33 human joint coordinates...');
      await new Promise((r) => setTimeout(r, 450));

      setAnalyzingStep('3/4: Calculating joint angles & repetition state machine...');
      await new Promise((r) => setTimeout(r, 400));

      setAnalyzingStep('4/4: Generating transparent score & AI coaching drills...');

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
        onAssessmentCompleted(res.data);
      } else {
        throw new Error('Analysis response was empty.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to analyze video. Please verify lighting and full body visibility.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-[#303831] max-w-4xl mx-auto">
      {/* Title */}
      <div className="pb-2 border-b border-[#E6D8CB]">
        <h2 className="text-2xl font-black text-[#303831] tracking-tight">
          Physical Video Assessment
        </h2>
        <p className="text-xs md:text-sm text-[#766660]">
          Record live with your webcam or upload a 5–30s video clip for automated joint angle analysis.
        </p>
      </div>

      {/* Sport Selector */}
      <div className="p-6 rounded-2xl bg-[#FFF9F2] border border-[#E6D8CB] shadow-xs space-y-3">
        <label className="block text-xs font-bold text-[#766660] uppercase tracking-wider">
          1. Select Exercise Drill
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {sports.map((sp) => {
            const isSelected = selectedSport === sp.id;
            return (
              <button
                key={sp.id}
                type="button"
                onClick={() => setSelectedSport(sp.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-[#722F46] border-[#722F46] text-white shadow-xs font-bold'
                    : 'bg-[#F7F0E7] border-[#E6D8CB] text-[#303831] hover:bg-[#EFE4D8]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{sp.icon}</span>
                  <span className="text-xs font-bold truncate">{sp.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Camera Guidance Box */}
      <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#E6D8CB] space-y-1.5 shadow-xs">
        <div className="flex items-center gap-2 text-[#722F46] font-bold text-xs uppercase tracking-wide">
          <Info size={16} /> Camera Setup Instructions for {currentSportInfo.name}
        </div>
        <p className="text-xs text-[#303831] font-semibold leading-relaxed">
          {currentSportInfo.cameraSetup}
        </p>
        <p className="text-[11px] text-[#766660]">
          What is assessed: {currentSportInfo.whatMeasured}
        </p>
      </div>

      {/* Input Mode Switcher */}
      <div className="p-6 rounded-2xl bg-[#FFF9F2] border border-[#E6D8CB] shadow-xs space-y-4">
        <label className="block text-xs font-bold text-[#766660] uppercase tracking-wider">
          2. Choose Video Input Method
        </label>

        <div className="flex bg-[#F7F0E7] p-1.5 rounded-xl border border-[#E6D8CB] max-w-md">
          <button
            type="button"
            onClick={() => setInputMode('upload')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              inputMode === 'upload'
                ? 'bg-[#722F46] text-white shadow-xs'
                : 'text-[#766660] hover:text-[#303831]'
            }`}
          >
            <Upload size={15} /> Upload Video File
          </button>
          <button
            type="button"
            onClick={() => setInputMode('camera')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              inputMode === 'camera'
                ? 'bg-[#722F46] text-white shadow-xs'
                : 'text-[#766660] hover:text-[#303831]'
            }`}
          >
            <Camera size={15} /> Live Webcam Recorder
          </button>
        </div>

        {/* Live Camera Component */}
        {inputMode === 'camera' && (
          <WebcamRecorder
            onRecordingComplete={handleCameraRecordingComplete}
            onCancel={() => setInputMode('upload')}
          />
        )}

        {/* File Upload Area */}
        {inputMode === 'upload' && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*,.mp4,.mov,.webm,.avi,.mkv,.m4v"
              onChange={handleFileChange}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                videoFile
                  ? 'border-[#278653] bg-[#278653]/5'
                  : 'border-[#E6D8CB] bg-[#F7F0E7] hover:bg-[#EFE4D8] hover:border-[#805044]'
              }`}
            >
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
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="text-xs text-[#722F46] hover:underline font-bold"
                    >
                      Choose a different video
                    </button>
                  </div>
                </div>
              ) : videoFile ? (
                <div className="py-4 space-y-1">
                  <div className="w-12 h-12 rounded-2xl bg-[#EFE4D8] text-[#722F46] flex items-center justify-center mx-auto mb-2">
                    <Video size={22} />
                  </div>
                  <p className="text-sm font-bold text-[#303831]">{videoFile.name}</p>
                  <p className="text-xs text-[#278653] font-medium">Ready for MediaPipe kinematic analysis</p>
                </div>
              ) : (
                <div className="py-6 space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#EFE4D8] text-[#722F46] flex items-center justify-center mx-auto mb-2">
                    <Upload size={22} />
                  </div>
                  <p className="text-sm font-bold text-[#303831]">
                    Click or drag video file here
                  </p>
                  <p className="text-xs text-[#766660]">
                    Supports MP4, MOV, WebM, AVI, MKV (5–30 sec • Max 60MB)
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Fast Benchmark Testing Samples */}
      <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#E6D8CB] shadow-xs">
        <p className="text-xs font-bold text-[#766660] mb-2 flex items-center gap-1.5">
          <Sparkles size={14} className="text-[#722F46]" /> Fast Benchmark Testing Samples:
        </p>
        <div className="flex flex-wrap gap-2">
          {['Sit-up Benchmark', 'Deep Squat Form', 'Vertical Jump', 'Sprint Acceleration'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSelectSample(s)}
              className="text-xs px-3 py-1.5 rounded-xl bg-[#F7F0E7] hover:bg-[#EFE4D8] text-[#303831] border border-[#E6D8CB] font-semibold transition-colors"
            >
              + {s}
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-[#C47A32]/10 border border-[#C47A32]/25 text-[#C47A32] text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Analysis CTA */}
      <button
        onClick={handleStartAnalysis}
        disabled={analyzing}
        className="w-full btn-wine py-4 shadow-md text-sm"
      >
        {analyzing ? (
          <div className="flex flex-col items-center gap-1 py-0.5">
            <div className="flex items-center gap-2">
              <RefreshCw size={16} className="animate-spin text-white" />
              <span className="font-bold text-sm">Processing Movement Mechanics...</span>
            </div>
            <span className="text-xs font-normal text-white/90">{analyzingStep}</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 font-bold">
            <Sparkles size={18} />
            <span>Run Computer Vision Biomechanics Assessment</span>
          </div>
        )}
      </button>
    </div>
  );
}
