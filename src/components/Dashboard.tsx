import { useState, FC } from "react";
import styled from "styled-components";
import ChartPanel, { ChartPanelProps } from "./ChartPanel";

const ChartsContainer = styled.div`
  width: 100vw;
  padding: 2rem 4rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(700px, 1fr));
  grid-template-rows: min-content;
  gap: 16px;
  box-sizing: border-box;
  overflow-y: scroll;
`;

const ChartCard: FC<ChartPanelProps> = styled(ChartPanel)`
  height: 300px;
  display: inline-flex;
  flex-direction: column;
  gap: 16px;
  border-radius: 8px;
  background-color: #f5f5f5;
  position: relative;

  button {
    border-color: rgba(0, 0, 0, 0.2);
    background: transparent;
    font-size: 1rem;
    font-weight: 700;
  }

  &::after {
    content: ${({ symbol }) => `"${symbol}"`};
    color: rgba(0, 0, 0, 0.2);
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 3rem;
    font-weight: 900;
    pointer-events: none;
  }
`;

const NewChartCard = styled.div`
  height: 300px;
  display: grid;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  background-color: #f5f5f5;
  box-sizing: border-box;
`;

interface ChartProps {
  id: number;
  symbol: string;
}

export default function Dashboard() {
  const [nextChartId, setNextChartId] = useState(1);
  const [charts, setCharts] = useState<ChartProps[]>([
    {
      id: 0,
      symbol: "EURUSD",
    },
  ]);

  const addChart = (symbol: string) => {
    setCharts((prev) => [
      ...prev,
      {
        id: nextChartId,
        symbol: symbol,
      },
    ]);
    setNextChartId((prev) => prev + 1);
  };

  const addChartEURUSD = () => addChart("EURUSD");
  const addChartUSDJPY = () => addChart("USDJPY");
  const addChartEURJPY = () => addChart("EURJPY");
  const addChartEURGBP = () => addChart("EURGBP");

  return (
    <ChartsContainer>
      {charts.map((chart) => (
        <ChartCard key={chart.id} symbol={chart.symbol} />
      ))}
      <NewChartCard>
        <button onClick={addChartEURUSD}>EURUSD</button>
        <button onClick={addChartUSDJPY}>USDJPY</button>
        <button onClick={addChartEURJPY}>EURJPY</button>
        <button onClick={addChartEURGBP}>EURGBP</button>
      </NewChartCard>
    </ChartsContainer>
  );
}
