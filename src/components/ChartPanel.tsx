import { FC, useEffect, useRef, memo, useCallback } from "react";
import { FTInteractiveChart } from "../core/index";

import styled from "styled-components";

const Canvas = styled.canvas`
  height: 100%;
`;

export interface ChartPanelProps {
  className?: string;
  key?: number;
  symbol: string;
}

const ChartPanel: FC<ChartPanelProps> = memo(function ({
  className,
  key: _key,
  symbol,
}: ChartPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<FTInteractiveChart | null>(null);

  function adjustCanvasForHighDPI(canvas) {
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
  }

  const destroyChartInstance = useCallback(() => {
    if (!chartRef.current) return;

    chartRef.current.destroy();
    chartRef.current = null;
  }, []);

  const createChartInstance = useCallback(() => {
    destroyChartInstance();

    if (!canvasRef.current) return;

    adjustCanvasForHighDPI(canvasRef.current);

    const chart = new FTInteractiveChart(canvasRef.current, symbol);
    chartRef.current = chart;
  }, [symbol, destroyChartInstance]);

  useEffect(() => {
    createChartInstance();
    return () => {
      destroyChartInstance();
    };
  }, []);

  return (
    <div className={className}>
      <Canvas key={_key} ref={canvasRef} />
    </div>
  );
});

export default ChartPanel;
