import { FC } from "react";

export interface ChartContainerProps {
  className?: string;
  key?: number;
  pair: string;
}

const ChartContainer: FC<ChartContainerProps> = function ({
  className,
  key: _key,
  pair,
}: ChartContainerProps) {
  return <div key={_key} className={className}></div>;
};

export default ChartContainer;
