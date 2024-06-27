import { useState, FC } from "react";
import styled from "styled-components";
import ChartContainer, { ChartContainerProps } from "./ChartContainer";

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

const ChartCard: FC<ChartContainerProps> = styled(ChartContainer)`
  height: 300px;
  display: inline-flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
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
    content: ${({ pair }) => `"${pair}"`};
    color: rgba(0, 0, 0, 0.2);
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 3rem;
    font-weight: 900;
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
`;

interface ChartProps {
  id: number;
  pair: string;
}

export default function Dashboard() {
  const [nextChartId, setNextChartId] = useState(1);
  const [charts, setCharts] = useState<ChartProps[]>([
    {
      id: 0,
      pair: "EURUSD",
    },
  ]);

  const addChart = (pair: string) => {
    setCharts((prev) => [
      ...prev,
      {
        id: nextChartId,
        pair: pair,
      },
    ]);
    setNextChartId((prev) => prev + 1);
  };

  return (
    <ChartsContainer>
      {charts.map((chart) => (
        <ChartCard key={chart.id} pair={chart.pair} />
      ))}
      <NewChartCard>
        <button onClick={() => addChart("EURUSD")}>EURUSD</button>
        <button onClick={() => addChart("USDJPY")}>USDJPY</button>
        <button onClick={() => addChart("EURJPY")}>EURJPY</button>
        <button onClick={() => addChart("EURGBP")}>EURGBP</button>
      </NewChartCard>
    </ChartsContainer>
  );
}
