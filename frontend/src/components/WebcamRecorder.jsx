import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Square,
  RefreshCw,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  Video,
  Sparkles
} from 'lucide-react';

export default function WebcamRecorder({ onRecordingComplete, onCancel }) {
  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState('');
  const [recordingState, setRecordingState] = useState('idle'); // 'idle' | 'countdown' | 'recording' | 'preview'
  const [countdown, setCountdown] = useState(3);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const videoLiveRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);

  // Initialize Camera on mount
  useEffect(() => {
    let activeStream = null;

    async function initCamera() {
      try {
        setCameraError('');
        const constraints = {
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          },
          audio: false
        };
        const userMediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        activeStream = userMediaStream;
        setStream(userMediaStream);
        if (videoLiveRef.current) {
          videoLiveRef.current.srcObject = userMediaStream;
        }
      } catch (err) {
        console.error('Camera access error:', err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setCameraError('Camera permission was denied. Please allow camera access in your browser settings or use video file upload.');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setCameraError('No camera found on this device. Please connect a webcam or upload a pre-recorded video.');
        } else {
          setCameraError(`Unable to start camera: ${err.message}. Please use video file upload.`);
        }
      }
    }

    initCamera();

    return () => {
      // Cleanup stream when unmounting
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  // Handle countdown before recording
  useEffect(() => {
    let countdownTimer = null;
    if (recordingState === 'countdown') {
      if (countdown > 1) {
        countdownTimer = setTimeout(() => {
          setCountdown((prev) => prev - 1);
        }, 1000);
      } else if (countdown === 1) {
        countdownTimer = setTimeout(() => {
          startActualRecording();
        }, 1000);
      }
    }
    return () => clearTimeout(countdownTimer);
  }, [recordingState, countdown]);

  const handleStartCountdown = () => {
    setCountdown(3);
    setRecordingState('countdown');
  };

  const startActualRecording = () => {
    if (!stream) return;
    recordedChunksRef.current = [];
    setElapsedSeconds(0);

    try {
      const mimeTypes = ['video/webm;codecs=vp9', 'video/webm', 'video/mp4'];
      let chosenMime = '';
      for (const mime of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mime)) {
          chosenMime = mime;
          break;
        }
      }

      const recorder = new MediaRecorder(stream, chosenMime ? { mimeType: chosenMime } : undefined);

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: chosenMime || 'video/mp4' });
        setRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        setRecordingState('preview');
      };

      mediaRecorderRef.current = recorder;
      recorder.start(250); // collect in 250ms chunks
      setRecordingState('recording');

      timerIntervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          if (prev >= 30) {
            handleStopRecording();
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (e) {
      console.error('MediaRecorder error:', e);
      setCameraError('Browser failed to initialize recording. Please use video file upload.');
      setRecordingState('idle');
    }
  };

  const handleStopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleRetake = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setRecordedBlob(null);
    setPreviewUrl(null);
    setRecordingState('idle');
    if (videoLiveRef.current && stream) {
      videoLiveRef.current.srcObject = stream;
    }
  };

  const handleUseRecording = () => {
    if (recordedBlob) {
      const fileName = `webcam_recording_${Date.now()}.mp4`;
      const file = new File([recordedBlob], fileName, { type: 'video/mp4' });
      onRecordingComplete(file, previewUrl);
    }
  };

  return (
    <div className="space-y-3 p-4 bg-[#FFF9F2] rounded-2xl border border-[#E6D8CB] shadow-xs animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-bold text-xs text-[#303831] flex items-center gap-1.5">
            <Camera size={15} className="text-[#722F46]" /> Live Camera Recorder
          </h4>
          <p className="text-[10px] text-[#766660]">Record directly with device webcam</p>
        </div>
        {recordingState === 'recording' && (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#570F22]/15 border border-[#570F22]/30 text-[#570F22] text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#570F22] animate-ping" />
            <span>00:{elapsedSeconds < 10 ? `0${elapsedSeconds}` : elapsedSeconds} / 00:30</span>
          </div>
        )}
      </div>

      {cameraError ? (
        <div className="p-4 rounded-xl bg-[#C47A32]/10 border border-[#C47A32]/20 text-[#C47A32] text-xs space-y-2 text-center">
          <AlertCircle size={22} className="mx-auto" />
          <p>{cameraError}</p>
          <button
            type="button"
            onClick={onCancel}
            className="btn-warm text-xs py-1.5 px-3 mt-1"
          >
            Switch to File Upload
          </button>
        </div>
      ) : (
        <div className="relative w-full aspect-[4/3] bg-black rounded-xl overflow-hidden border border-[#E6D8CB]">
          {/* Live Video Feed */}
          {recordingState !== 'preview' ? (
            <video
              ref={videoLiveRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100"
            />
          ) : (
            <video
              src={previewUrl}
              controls
              playsInline
              className="w-full h-full object-contain bg-black"
            />
          )}

          {/* Framing Guide Overlay */}
          {recordingState === 'idle' && (
            <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-[#E6D8CB]/80 m-4 rounded-lg flex flex-col justify-between p-2">
              <span className="text-[9px] font-bold text-white bg-[#321B1A]/70 px-2 py-0.5 rounded self-center backdrop-blur-xs">
                Align Full Body (Head to Feet Visible)
              </span>
              <span className="text-[8px] text-white/90 bg-[#321B1A]/70 px-2 py-0.5 rounded self-center backdrop-blur-xs">
                Stand or lie 2.5–3m away in bright, clear lighting
              </span>
            </div>
          )}

          {/* Countdown Overlay */}
          {recordingState === 'countdown' && (
            <div className="absolute inset-0 bg-[#321B1A]/80 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-1">
              <span className="text-5xl font-black animate-ping text-[#E6D8CB]">{countdown}</span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFF9F2]">Get in Position...</span>
            </div>
          )}
        </div>
      )}

      {/* Action Controls */}
      <div className="flex gap-2 pt-1">
        {recordingState === 'idle' && (
          <>
            <button
              type="button"
              onClick={handleStartCountdown}
              disabled={!stream}
              className="flex-1 btn-wine py-2.5 text-xs flex items-center justify-center gap-1.5"
            >
              <Camera size={14} /> Start 3s Countdown & Record
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="btn-outline py-2.5 px-3 text-xs"
            >
              Cancel
            </button>
          </>
        )}

        {recordingState === 'recording' && (
          <button
            type="button"
            onClick={handleStopRecording}
            className="w-full py-2.5 rounded-xl bg-[#570F22] hover:bg-[#321B1A] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <Square size={14} fill="currentColor" /> Stop Recording & Review
          </button>
        )}

        {recordingState === 'preview' && (
          <>
            <button
              type="button"
              onClick={handleRetake}
              className="flex-1 btn-outline py-2.5 text-xs flex items-center justify-center gap-1.5"
            >
              <RefreshCw size={13} /> Retake
            </button>
            <button
              type="button"
              onClick={handleUseRecording}
              className="flex-1 btn-wine py-2.5 text-xs flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 size={14} /> Use This Video
            </button>
          </>
        )}
      </div>
    </div>
  );
}
