import React, { useState, useRef, useCallback } from 'react';
import { BUILDINGS, MAP_FEATURES, MAP_WIDTH, MAP_HEIGHT } from '../data/mapData.js';

export default function Map({ onSelect, selectedBuilding, correctBuilding, wrongBuilding, disabled }) {
  const [tooltip, setTooltip] = useState(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef(null);
  const svgRef = useRef(null);

  // Touch pinch-zoom state
  const lastPinchDist = useRef(null);

  const getBuildingFill = useCallback(
    (building) => {
      if (correctBuilding && building.name === correctBuilding) return '#16a34a';
      if (wrongBuilding && building.name === wrongBuilding) return '#dc2626';
      if (selectedBuilding && building.name === selectedBuilding) return '#003366';
      return building.color;
    },
    [selectedBuilding, correctBuilding, wrongBuilding]
  );

  const getBuildingOpacity = useCallback(
    (building) => {
      if (disabled) return 0.55;
      if (selectedBuilding && building.name !== selectedBuilding) return 0.6;
      return 0.75;
    },
    [selectedBuilding, disabled]
  );

  const handleBuildingClick = (building) => {
    if (disabled) return;
    onSelect(building.name);
  };

  // Mouse pan
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsPanning(true);
    panStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e) => {
    if (!isPanning || !panStart.current) return;
    setPan({ x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    panStart.current = null;
  };

  // Wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((s) => Math.min(Math.max(s * delta, 0.5), 4));
  };

  // Touch zoom
  const getTouchDist = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      lastPinchDist.current = getTouchDist(e.touches);
    } else if (e.touches.length === 1) {
      setIsPanning(true);
      panStart.current = { x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y };
    }
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (e.touches.length === 2 && lastPinchDist.current != null) {
      const dist = getTouchDist(e.touches);
      const ratio = dist / lastPinchDist.current;
      setScale((s) => Math.min(Math.max(s * ratio, 0.5), 4));
      lastPinchDist.current = dist;
    } else if (e.touches.length === 1 && isPanning && panStart.current) {
      setPan({ x: e.touches[0].clientX - panStart.current.x, y: e.touches[0].clientY - panStart.current.y });
    }
  };

  const handleTouchEnd = () => {
    setIsPanning(false);
    lastPinchDist.current = null;
    panStart.current = null;
  };

  const handleReset = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden border-2 border-dku-blue bg-white shadow-inner select-none">
      {/* Controls */}
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
        <button
          onClick={() => setScale((s) => Math.min(s * 1.25, 4))}
          className="w-8 h-8 bg-white border border-gray-300 rounded shadow text-lg font-bold hover:bg-gray-50 flex items-center justify-center"
          title="Zoom in"
        >+</button>
        <button
          onClick={() => setScale((s) => Math.max(s * 0.8, 0.5))}
          className="w-8 h-8 bg-white border border-gray-300 rounded shadow text-lg font-bold hover:bg-gray-50 flex items-center justify-center"
          title="Zoom out"
        >−</button>
        <button
          onClick={handleReset}
          className="w-8 h-8 bg-white border border-gray-300 rounded shadow text-xs font-bold hover:bg-gray-50 flex items-center justify-center"
          title="Reset view"
        >⌂</button>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-20 bg-dku-blue text-white text-sm px-3 py-1.5 rounded-lg shadow-lg pointer-events-none whitespace-nowrap"
          style={{ left: tooltip.x + 12, top: tooltip.y - 10, maxWidth: 220 }}
        >
          <div className="font-semibold">{tooltip.name}</div>
          {tooltip.short && <div className="text-xs text-blue-200">{tooltip.short}</div>}
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-2 left-2 z-10 bg-white bg-opacity-90 rounded-lg px-2 py-1.5 text-xs space-y-0.5 shadow border border-gray-200">
        {correctBuilding && (
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-green-600 inline-block" />
            <span>Correct location</span>
          </div>
        )}
        {wrongBuilding && (
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-red-600 inline-block" />
            <span>Your guess</span>
          </div>
        )}
        {!correctBuilding && !wrongBuilding && (
          <>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-dku-blue inline-block" />
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-blue-200 inline-block" />
              <span>Building</span>
            </div>
          </>
        )}
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-blue-300 inline-block" />
          <span>Lake</span>
        </div>
      </div>

      {/* SVG Map */}
      <div
        className="overflow-hidden"
        style={{ cursor: isPanning ? 'grabbing' : 'grab', touchAction: 'none', height: 400 }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          width="100%"
          height="100%"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isPanning ? 'none' : 'transform 0.1s ease',
          }}
        >
          {/* Static features */}
          {MAP_FEATURES.map((f) => {
            if (f.type === 'rect') {
              return (
                <rect
                  key={f.id}
                  x={f.x} y={f.y} width={f.w} height={f.h}
                  fill={f.fill}
                  stroke={f.stroke}
                  strokeWidth={f.strokeWidth || 0}
                />
              );
            }
            if (f.type === 'polygon') {
              return (
                <polygon
                  key={f.id}
                  points={f.points}
                  fill={f.fill}
                  stroke={f.stroke}
                  strokeWidth={f.strokeWidth || 0}
                />
              );
            }
            return null;
          })}

          {/* North label */}
          <text x="500" y="30" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#003366" fontFamily="Arial">
            ↑ N
          </text>

          {/* Lake label */}
          <text x="265" y="380" textAnchor="middle" fontSize="11" fill="#1a6a8a" fontFamily="Arial" fontStyle="italic">
            Campus Lake
          </text>

          {/* Building zones */}
          {BUILDINGS.map((building) => {
            const isSelected = selectedBuilding === building.name;
            const isCorrect = correctBuilding === building.name;
            const isWrong = wrongBuilding === building.name;

            return (
              <g
                key={building.id}
                className="map-zone"
                onClick={(e) => { e.stopPropagation(); handleBuildingClick(building); }}
                onMouseEnter={(e) => {
                  if (disabled) return;
                  const rect = svgRef.current?.getBoundingClientRect();
                  if (rect) setTooltip({ name: building.name, short: building.description, x: e.clientX - rect.left, y: e.clientY - rect.top });
                }}
                onMouseLeave={() => setTooltip(null)}
                style={{ cursor: disabled ? 'default' : 'pointer' }}
              >
                <polygon
                  points={building.points}
                  fill={getBuildingFill(building)}
                  fillOpacity={getBuildingOpacity(building)}
                  stroke={isSelected || isCorrect || isWrong ? '#fff' : '#fff'}
                  strokeWidth={isSelected || isCorrect || isWrong ? 2.5 : 1}
                  strokeOpacity={0.8}
                />
                {/* Short name label */}
                <text
                  x={building.labelX}
                  y={building.labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="11"
                  fontWeight="bold"
                  fill="white"
                  fontFamily="Arial, sans-serif"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {building.shortName}
                </text>

                {/* Checkmark on correct, X on wrong */}
                {isCorrect && (
                  <text x={building.labelX} y={building.labelY - 18} textAnchor="middle" fontSize="16" fill="white" style={{ pointerEvents: 'none' }}>
                    ✓
                  </text>
                )}
                {isWrong && (
                  <text x={building.labelX} y={building.labelY - 18} textAnchor="middle" fontSize="16" fill="white" style={{ pointerEvents: 'none' }}>
                    ✗
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Scroll hint */}
      <div className="text-center text-xs text-gray-400 py-1 bg-gray-50 border-t border-gray-100">
        Scroll or pinch to zoom · Drag to pan · Click a building to guess
      </div>
    </div>
  );
}
