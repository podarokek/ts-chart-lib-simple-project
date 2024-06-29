import { FC, useEffect, useRef, memo, useCallback } from "react";
import { FTInteractiveChart } from "../core/index";

import styled from "styled-components";

const Canvas = styled.canvas`
  height: 100%;
  background-color: #fff;
  box-shadow: 0px 0px 16px #00000047;
  overflow: hidden;
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

  const destroyChartInstance = useCallback(() => {
    if (!chartRef.current) return;

    chartRef.current.destroy();
    chartRef.current = null;
  }, []);

  const createChartInstance = useCallback(() => {
    destroyChartInstance();

    if (!canvasRef.current) return;

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
