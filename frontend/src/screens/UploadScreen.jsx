import React, { useState, useRef } from 'react';
import { Upload, Video, Play, CheckCircle2, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';
import { uploadAndAnalyzeVideo } from '../services/api';

export default function UploadScreen({ user, initialSport, onAssessmentCompleted }) {
  const [selectedSport, setSelectedSport] = useState(initialSport || 'Cricket');
  const [videoFile, setVideoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzingStep, setAnalyzingStep] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const sports = [
    { id: 'Cricket', name: 'Cricket', icon: '🏏' },
    { id: 'Basketball', name: 'Basketball', icon: '🏀' },
    { id: 'Sprinting', name: 'Sprinting', icon: '⚡' },
    { id: 'Fitness/Squats', name: 'Fitness/Squats', icon: '🏋️' },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        setErrorMsg('Please select a valid video file (.mp4, .mov, .webm, etc.)');
        return;
      }
      setVideoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMsg('');
    }
  };

  const handleSelectSample = (sampleName) => {
    // Create a mock video blob for testing if the user doesn't have a video file handy
    const mockFile = new File(['mock_video_bytes'], `${sampleName.toLowerCase()}_sample.mp4`, { type: 'video/mp4' });
    setVideoFile(mockFile);
    setPreviewUrl(null);
    setErrorMsg('');
  };

  const handleStartAnalysis = async () => {
    if (!videoFile) {
      setErrorMsg('Please upload a video or pick a sample recording first.');
      return;
    }

    setAnalyzing(true);
    setErrorMsg('');

    // Step-by-step progress feedback for computer vision
    setAnalyzingStep('Loading video into computer vision pipeline...');
    await new Promise((r) => setTimeout(r, 600));

    setAnalyzingStep('MediaPipe Pose: Extracting 33 human joint coordinates...');
    await new Promise((r) => setTimeout(r, 800));

    setAnalyzingStep('Computing kinetic angles & velocity vectors...');
    await new Promise((r) => setTimeout(r, 800));

    setAnalyzingStep('Generating talent score & AI coach feedback...');

    const formData = new FormData();
    formData.append('sport', selectedSport);
    formData.append('user_id', user?.id || 1);
    formData.append('video', videoFile);

    try {
      const res = await uploadAndAnalyzeVideo(formData);
      if (res.success && res.data) {
        // Save to local history as well
        const key = `history_${user?.id || 1}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        localStorage.setItem(key, JSON.stringify([res.data, ...existing]));
        onAssessmentCompleted(res.data);
      } else {
        throw new Error('Analysis response was empty');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to analyze video');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in pb-4">
      {/* Title */}
      <div>
        <h2 className="text-lg font-black text-white">AI Motion Assessment</h2>
        <p className="text-xs text-slate-400">Select sport, provide a 5-15s clip, and let AI score form.</p>
      </div>

      {/* Sport Selector Carousel */}
      <div>
        <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
          1. Target Sport Category
        </label>
        <div className="grid grid-cols-2 gap-2">
          {sports.map((sp) => {
            const isSelected = selectedSport === sp.id;
            return (
              <button
                key={sp.id}
                type="button"
                onClick={() => setSelectedSport(sp.id)}
                className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900/80 border-white/5 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="text-lg">{sp.icon}</span>
                <span>{sp.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Video Upload Area */}
      <div>
        <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
          2. Performance Video
        </label>

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
            videoFile
              ? 'border-cyan-400/60 bg-cyan-950/20'
              : 'border-white/15 bg-slate-900/60 hover:bg-slate-900/90 hover:border-cyan-500/40'
          }`}
        >
          {previewUrl ? (
            <div className="space-y-2">
              <video
                src={previewUrl}
                controls
                className="w-full max-h-48 rounded-xl object-contain bg-black"
              />
              <p className="text-xs text-cyan-300 font-semibold truncate flex items-center justify-center gap-1">
                <CheckCircle2 size={14} className="text-emerald-400" />
                {videoFile?.name}
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="text-[11px] text-slate-400 hover:text-white underline"
              >
                Choose another file
              </button>
            </div>
          ) : videoFile ? (
            <div className="py-3">
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-2">
                <Video size={24} />
              </div>
              <p className="text-xs text-white font-bold">{videoFile.name}</p>
              <p className="text-[11px] text-emerald-400 mt-0.5">Video loaded and ready for AI engine</p>
            </div>
          ) : (
            <div className="py-4">
              <div className="w-12 h-12 rounded-full bg-white/5 text-cyan-400 flex items-center justify-center mx-auto mb-2">
                <Upload size={22} />
              </div>
              <p className="text-xs font-bold text-white">Tap to upload motion video</p>
              <p className="text-[10px] text-slate-400 mt-1">Supports MP4, MOV, WebM (5-15 sec recommended)</p>
            </div>
          )}
        </div>
      </div>

      {/* Fast Testing Sample Picker */}
      <div className="p-3 rounded-xl bg-slate-900/70 border border-white/5">
        <p className="text-[11px] font-bold text-slate-400 mb-2 flex items-center gap-1">
          <Sparkles size={12} className="text-cyan-400" /> Or use quick demo sports sample:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {['Bowling Runup', 'Jump Shot Form', '100m Sprint', 'Deep Squat'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSelectSample(s)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-300 text-slate-300 border border-white/10 transition-colors"
            >
              + {s}
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Analysis CTA Button */}
      <button
        onClick={handleStartAnalysis}
        disabled={analyzing}
        className="w-full btn-primary py-3.5 mt-2"
      >
        {analyzing ? (
          <div className="flex flex-col items-center gap-1 py-1">
            <div className="flex items-center gap-2">
              <RefreshCw size={16} className="animate-spin text-slate-950" />
              <span className="font-bold">Analyzing Video with AI...</span>
            </div>
            <span className="text-[10px] font-normal text-slate-900 tracking-tight">{analyzingStep}</span>
          </div>
        ) : (
          <>
            <Sparkles size={18} />
            <span>Run Computer Vision Assessment</span>
          </>
        )}
      </button>
    </div>
  );
}
