'use client';

import type { ReactNode } from 'react';
import { Modal } from 'antd';
import { cn } from '@/shared/utils/cn';

interface AntdModalShellProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  width?: number | string;
  zIndex?: number;
  maskClosable?: boolean;
  className?: string;
  maskColor?: string;
}

export function AntdModalShell({
  open,
  onClose,
  children,
  width = 720,
  zIndex,
  maskClosable = true,
  className,
  maskColor = 'rgba(0, 0, 0, 0.2)',
}: AntdModalShellProps) {
  const styleModal = [
    '[&_.ant-modal-body]:!p-0',
    '[&_.ant-modal-content]:!overflow-hidden',
    '[&_.ant-modal-content]:!rounded-[32px]',
    '[&_.ant-modal-content]:!bg-white',
    '[&_.ant-modal-content]:!p-0',
    '[&_.ant-modal-content]:!shadow-[0_25px_50px_-12px_rgba(91,58,41,0.18)]',
    '[&_.glass-card]:!rounded-none',
    '[&_.glass-card]:!border-0',
    '[&_.glass-card]:!bg-transparent',
    '[&_.glass-card]:!shadow-none',
    '[&_.glass-card]:!backdrop-blur-none',
  ].join(' ');
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={width}
      zIndex={zIndex}
      closable={false}
      closeIcon={null}
      destroyOnHidden
      mask={{ blur: true, closable: maskClosable }}
      className={cn(
        styleModal,
        className
      )}
      classNames={{
        container: 'rounded-4xl!',
        body: 'p-0!',
      }}
      styles={{
        mask: { backgroundColor: maskColor },
      }}
    >
      {children}
    </Modal>
  );
}
