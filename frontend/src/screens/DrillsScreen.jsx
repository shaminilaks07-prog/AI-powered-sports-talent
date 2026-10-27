import React, { useState } from 'react';
import {
  Compass,
  Play,
  Camera,
  Info,
  Shield,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function DrillsScreen({ onSelectDrill }) {
  const [selectedDrill, setSelectedDrill] = useState(null);

  const drills = [
    {
      id: 'Sit-ups and Core Endurance',
      name: 'Sit-ups & Core Endurance',
      category: 'Core & Trunk Stability',
      icon: '🧘',
      status: 'Fully Implemented',
      tag: 'Rep Counter & Cadence',
      whatAssessed: 'Abdominal flexion, hip flexion angle (shoulder-hip-knee), cadence (reps/min), spinal rhythm, and repetition consistency.',
      cameraSetup: 'Position phone at waist/mat level, 2.5 meters away from side profile. Athlete head, torso, hips, and knees must remain in frame throughout the motion.',
      equipmentNeeded: 'Yoga mat or flat firm ground. Free of obstacles.',
      safetyGuide: 'Keep feet anchored or flat. Avoid jerking the neck with hands clasped behind the head; place fingertips by temples or across chest.',
      canMeasure: 'Counts valid repetitions, tracks peak hip curl angle, detects jerky transitions, measures pace over time.',
      cannotMeasure: 'Cannot replace direct EMG muscle activation measurements; cannot judge spinal disc pressure.'
    },
    {
      id: 'Squats and Lower-Body Movement',
      name: 'Squats & Lower-Body Power',
      category: 'Lower Body Strength',
      icon: '🏋️',
      status: 'Fully Implemented',
      tag: 'Knee Depth & Symmetry',
      whatAssessed: 'Knee flexion angle (hip-knee-ankle), squat depth (parallel 90° vs deep), bilateral knee symmetry, and upright torso alignment.',
      cameraSetup: 'Waist height, 3 meters away at 45° angle or direct side profile. Full body from head to feet visible.',
      equipmentNeeded: 'Flat ground with non-slip footwear or bare feet.',
      safetyGuide: 'Maintain chest up, push knees outward over the toes, and avoid rounding the lower lumbar spine.',
      canMeasure: 'Measures minimum knee angle reached, counts squat cycles, assesses left/right symmetry.',
      cannotMeasure: 'Cannot evaluate barbell weight or external load; focuses exclusively on bodyweight movement mechanics.'
    },
    {
      id: 'Jumping Exercises',
      name: 'Vertical Jump Mechanics',
      category: 'Explosive Power',
      icon: '⚡',
      status: 'Fully Implemented',
      tag: 'Takeoff Velocity & Loading',
      whatAssessed: 'Countermovement knee dip angle, explosive vertical takeoff velocity of hips, flight extension, and soft landing cushion.',
      cameraSetup: 'Direct frontal or side view at 3 meters away. Ensure sufficient vertical clearance so head remains in frame at jump peak.',
      equipmentNeeded: 'Even, non-slippery surface with good headroom.',
      safetyGuide: 'Land softly through the forefoot with knees bent (cushioning at ~120°) to protect knee joints.',
      canMeasure: 'Relative vertical displacement speed, loading dip angle, bilateral takeoff symmetry.',
      cannotMeasure: 'Cannot replace contact-mat jump mats or dual force plates; provides optical kinematic indicators.'
    },
    {
      id: 'Running and Sprinting',
      name: 'Sprint Stride & Acceleration',
      category: 'Locomotor Speed',
      icon: '🏃',
      status: 'Fully Implemented',
      tag: 'Knee Drive & Trunk Lean',
      whatAssessed: 'Dynamic knee recovery height (flexion), forward acceleration torso lean, ground reaction extension, and cadence.',
      cameraSetup: 'Side profile pass at waist level, 4 meters away on a track or open field.',
      equipmentNeeded: 'Athletic track, grass pitch, or sports court (15–30 meters straight).',
      safetyGuide: 'Warm up thoroughly with dynamic hamstring and groin mobility drills prior to maximal acceleration.',
      canMeasure: 'Trunk lean angle, recovery knee drive angle, stride frequency.',
      cannotMeasure: 'Cannot measure laser-timed 100m split fractions to millisecond precision.'
    },
    {
      id: 'Balance and Posture Assessment',
      name: 'Static Balance & Posture',
      category: 'Neuromuscular Balance',
      icon: '⚖️',
      status: 'Fully Implemented',
      tag: 'Proprioception & Sway',
      whatAssessed: 'Center-of-mass lateral and anterior-posterior sway variance, spinal verticality, bilateral shoulder and pelvic level deviation.',
      cameraSetup: 'Frontal eye level, 2.5 meters away in steady, bright lighting.',
      equipmentNeeded: 'Flat level floor, bare feet or stable flat-sole trainers.',
      safetyGuide: 'Perform in open space near a wall or chair if unsteady.',
      canMeasure: 'Center of mass sway standard deviation, head-spine-hip tilt angle, shoulder level.',
      cannotMeasure: 'Cannot diagnose inner-ear vestibular conditions; measures postural stability mechanics.'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in text-[#303831] max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-[#E6D8CB]">
        <h2 className="text-2xl font-black text-[#303831] tracking-tight">
          Exercise Drills & Movement Protocols
        </h2>
        <p className="text-xs md:text-sm text-[#766660]">
          Standardized movement assessments, camera positioning rules, and metric specifications.
        </p>
      </div>

      {/* Selected Drill Modal / Card */}
      {selectedDrill && (
        <div className="p-6 rounded-3xl bg-[#FFF9F2] border-2 border-[#722F46] shadow-md space-y-4 animate-fade-in">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedDrill.icon}</span>
              <div>
                <h3 className="font-extrabold text-base text-[#303831]">{selectedDrill.name}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#722F46]/10 text-[#722F46] border border-[#722F46]/20 uppercase">
                  {selectedDrill.category}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedDrill(null)}
              className="text-xs text-[#766660] hover:text-[#303831] font-bold p-1 rounded-lg hover:bg-[#EFE4D8]"
            >
              ✕ Close Guide
            </button>
          </div>

          <div className="space-y-3 text-xs text-[#766660]">
            <div className="p-3.5 rounded-xl bg-[#F7F0E7] border border-[#E6D8CB]">
              <span className="font-bold text-[#722F46] text-xs block uppercase mb-1">
                Biomechanical Evaluation Scope:
              </span>
              <p className="text-xs text-[#303831] leading-relaxed">{selectedDrill.whatAssessed}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FFF9F2] border border-[#E6D8CB]">
              <span className="font-bold text-[#303831] text-xs block mb-1">
                📸 Camera Placement & Calibration:
              </span>
              <p className="text-xs text-[#766660] leading-relaxed">{selectedDrill.cameraSetup}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FFF9F2] border border-[#E6D8CB]">
              <span className="font-bold text-[#303831] text-xs block mb-1">
                🛡️ Athlete Safety Guidance:
              </span>
              <p className="text-xs text-[#766660] leading-relaxed">{selectedDrill.safetyGuide}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-3 rounded-xl bg-[#278653]/10 border border-[#278653]/25">
                <span className="font-bold text-[#278653] block">✓ What is Measured:</span>
                <p className="text-[#303831] mt-1 text-[11px] leading-relaxed">{selectedDrill.canMeasure}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#F7F0E7] border border-[#E6D8CB]">
                <span className="font-bold text-[#766660] block">✗ Transparent Limits:</span>
                <p className="text-[#766660] mt-1 text-[11px] leading-relaxed">{selectedDrill.cannotMeasure}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectDrill(selectedDrill.id)}
            className="w-full btn-wine text-xs py-3 flex items-center justify-center gap-2 shadow-sm"
          >
            <Play size={14} fill="currentColor" />
            <span>Assess This Exercise with Computer Vision</span>
          </button>
        </div>
      )}

      {/* Drills List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {drills.map((drill) => (
          <div
            key={drill.id}
            onClick={() => setSelectedDrill(drill)}
            className="p-5 rounded-2xl bg-[#FFF9F2] hover:bg-[#fff6ec] border border-[#E6D8CB] hover:border-[#722F46] transition-all cursor-pointer shadow-xs flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-[#EFE4D8] flex items-center justify-center text-2xl shrink-0 group-hover:bg-[#722F46]/15 transition-colors">
                {drill.icon}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-xs text-[#303831] group-hover:text-[#722F46] transition-colors truncate">
                    {drill.name}
                  </h4>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#EFE4D8] text-[#4B2925] shrink-0">
                    {drill.tag}
                  </span>
                </div>
                <p className="text-[11px] text-[#766660] line-clamp-1 mt-1 leading-snug">
                  {drill.whatAssessed}
                </p>
              </div>
            </div>

            <ChevronRight size={17} className="text-[#805044] group-hover:text-[#722F46] shrink-0 ml-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
