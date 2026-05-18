import dayjs from "dayjs";
import { dailyReports } from "../mocks/dailyReports.mock";

export const aovTrendData = dailyReports.map((item) => ({
  date: dayjs(item.date).format('DD/MM'),
  aov: item.aov,
}));