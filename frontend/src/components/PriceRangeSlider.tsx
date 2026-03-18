import { useEffect, useRef, ChangeEvent } from 'react';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  step: number;
  onRangeChange: (newRange: [number, number]) => void;
  currentRange: [number, number];
}

export default function PriceRangeSlider({
  min,
  max,
  step,
  onRangeChange,
  currentRange
}: PriceRangeSliderProps) {
  const maxInputRef = useRef<HTMLInputElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const updateTrack = () => {
    if (!maxInputRef.current || !trackRef.current) return;

    const maxVal = Number(maxInputRef.current.value);
    const maxPercent = ((maxVal - min) / (max - min)) * 100;

    trackRef.current.style.right = `${100 - maxPercent}%`;
  };

  useEffect(() => {
    updateTrack();
  }, [currentRange, min, max]);

  const handleMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newMax = Number(e.target.value);
    // Left side is always fixed at min
    onRangeChange([min, newMax]);
  };

  return (
    <div className="w-full">
      <div className="relative h-8 flex items-center">
        {/* Background track */}
        <div className="absolute h-1 w-full bg-slate-200 rounded-full pointer-events-none" />

        {/* Active track from min to maxVal */}
        <div
          ref={trackRef}
          className="absolute h-1 bg-slate-900 rounded-full pointer-events-none transition-all duration-100"
          style={{
            left: '0%',
            right: '0%'
          }}
        />

        {/* Only right handle input - draggable */}
        <input
          ref={maxInputRef}
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentRange[1]}
          onChange={handleMaxChange}
          className="absolute w-full h-8 top-0 left-0 appearance-none bg-transparent cursor-pointer outline-none"
          style={{
            zIndex: 4
          }}
        />

        <style>{`
          input[type='range'] {
            -webkit-appearance: none;
            width: 100%;
            height: 32px;
            border-radius: 5px;
            background: transparent;
            outline: none;
          }

          input[type='range']::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: white;
            cursor: pointer;
            border: 3px solid #111827;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            transition: all 0.2s ease;
          }

          input[type='range']::-webkit-slider-thumb:hover {
            transform: scale(1.15);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
          }

          input[type='range']::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: white;
            cursor: pointer;
            border: 3px solid #111827;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            transition: all 0.2s ease;
          }

          input[type='range']::-moz-range-thumb:hover {
            transform: scale(1.15);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
          }
        `}</style>
      </div>
    </div>
  );
}
