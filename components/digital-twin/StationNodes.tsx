"use client";
import React from 'react';
import { MOCK_STATIONS } from '../../config/stations';
import { StationNode } from './StationNode';

export function StationNodes() {
  return (
    <group>
      {MOCK_STATIONS.map((station) => (
        <StationNode key={station.id} station={station} />
      ))}
    </group>
  );
}
