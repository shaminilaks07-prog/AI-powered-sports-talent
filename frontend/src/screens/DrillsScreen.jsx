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
  Sparkles
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
    <div className="space-y-4 animate-fade-in pb-4 text-[#303831]">
      <div>
        <h2 className="text-lg font-black text-[#303831]">Sports & Exercise Drills</h2>
        <p className="text-xs text-[#5A655C]">
          Explore supported biomechanical assessments, camera guidelines, and safety criteria.
        </p>
      </div>

      {/* Drill Detail Modal (if one is clicked) */}
      {selectedDrill && (
        <div className="p-4 rounded-2xl bg-white border border-[#46664F]/30 shadow-md space-y-3 animate-fade-in">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedDrill.icon}</span>
              <div>
                <h3 className="font-bold text-sm text-[#303831]">{selectedDrill.name}</h3>
                <span className="badge-sage text-[9px]">{selectedDrill.category}</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedDrill(null)}
              className="text-xs text-[#5A655C] hover:text-[#303831] font-bold p-1"
            >
              ✕ Close
            </button>
          </div>

          <div className="space-y-2 text-xs text-[#5A655C]">
            <div className="p-2.5 rounded-xl bg-[#F3F1E8]">
              <span className="font-bold text-[#46664F] text-[11px] block uppercase mb-0.5">What is Evaluated:</span>
              <p className="text-[11px] text-[#303831] leading-snug">{selectedDrill.whatAssessed}</p>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-[#E5E7E2]">
              <span className="font-bold text-[#303831] text-[11px] block mb-0.5">📸 Camera Setup & Placement:</span>
              <p className="text-[11px] leading-snug">{selectedDrill.cameraSetup}</p>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-[#E5E7E2]">
              <span className="font-bold text-[#303831] text-[11px] block mb-0.5">🛡️ Safety & Execution:</span>
              <p className="text-[11px] leading-snug">{selectedDrill.safetyGuide}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="p-2 rounded-lg bg-[#DCE8D8]/50 border border-[#46664F]/20">
                <span className="font-bold text-[#46664F] block">✓ What it measures:</span>
                <p className="text-[#303831] mt-0.5">{selectedDrill.canMeasure}</p>
              </div>
              <div className="p-2 rounded-lg bg-[#F8F9F6] border border-[#E5E7E2]">
                <span className="font-bold text-[#7C887E] block">✗ Transparent limits:</span>
                <p className="text-[#5A655C] mt-0.5">{selectedDrill.cannotMeasure}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectDrill(selectedDrill.id)}
            className="w-full btn-forest text-xs py-2.5 flex items-center justify-center gap-1.5"
          >
            <Play size={13} fill="currentColor" /> Assess This Drill with AI
          </button>
        </div>
      )}

      {/* Drill Cards List */}
      <div className="space-y-2">
        {drills.map((drill) => (
          <div
            key={drill.id}
            onClick={() => setSelectedDrill(drill)}
            className="p-3.5 rounded-2xl bg-white hover:bg-[#F8F9F6] border border-[#E5E7E2] hover:border-[#8FB8AC] transition-all cursor-pointer shadow-xs flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#F3F1E8] flex items-center justify-center text-2xl shrink-0 group-hover:bg-[#DCE8D8] transition-colors">
                {drill.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-xs text-[#303831] group-hover:text-[#46664F] transition-colors">
                    {drill.name}
                  </h4>
                  <span className="badge-sage text-[8px] py-0.2 px-1.5">{drill.tag}</span>
                </div>
                <p className="text-[10px] text-[#5A655C] line-clamp-1 mt-0.5">{drill.whatAssessed}</p>
              </div>
            </div>

            <ChevronRight size={15} className="text-[#7C887E] group-hover:text-[#46664F] shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
