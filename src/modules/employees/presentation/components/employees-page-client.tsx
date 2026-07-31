'use client';

import {
  ConfigProvider,
  App,
} from 'antd';
import { antdTheme } from '@/shared/utils/antdTheme';
import EmployeesPageInner from './EmployeesPage';


export default function EmployeesPage() {
  return (
    <ConfigProvider theme={antdTheme}>
      <App>
        <EmployeesPageInner />
      </App>
    </ConfigProvider>
  );
}
