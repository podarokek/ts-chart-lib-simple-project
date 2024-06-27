import { FC, useEffect, useRef, memo } from "react";
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

  function createChartInstance() {
    destroyChartInstance();

    if (!canvasRef.current) return;

    const chart = new FTInteractiveChart(canvasRef.current, symbol);
    chartRef.current = chart;
  }

  function destroyChartInstance() {
    if (!chartRef.current) return;

    chartRef.current.destroy();
    chartRef.current = null;
  }

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
