import { useMemo } from 'react';
import { useJalPulseStore } from '../store/useJalPulseStore';
import { useSimulation } from './useSimulation';
import { generatePrototypeForecast } from '../lib/forecasting/forecastEngine';
import { downsampleTimeSeries } from '../lib/utils/analytics';

export function useForecast() {
  const selectedStationId = useJalPulseStore(state => state.selectedStationId);
  const selectedParameter = useJalPulseStore(state => state.selectedParameter);
  const forecastHorizon = useJalPulseStore(state => state.forecastHorizon);
  const { history, snapshot } = useSimulation();
  
  const forecast = useMemo(() => {
    // Only target a specific station, fallback to first station if none selected
    const targetStation = selectedStationId || Object.keys(history)[0];
    const param = selectedParameter || 'BOD';

    if (!targetStation || !history[targetStation]?.[param]) {
      return null;
    }

    // Downsample historical to avoid massive regression arrays, keeping 200 points
    const rawData = history[targetStation][param];
    const downsampled = downsampleTimeSeries(rawData, 200);

    return generatePrototypeForecast(targetStation, param, downsampled, forecastHorizon);
  }, [history, selectedStationId, selectedParameter, forecastHorizon]);

  return {
    forecast,
    loading: false,
    selectedStationId: selectedStationId || Object.keys(history)[0],
    selectedParameter: selectedParameter || 'BOD',
    horizon: forecastHorizon,
    status: snapshot.status
  };
}
