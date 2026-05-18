import { Card, Skeleton } from "antd";

export const renderLoading = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="!rounded-3xl !border-[#D8B894]/20 !bg-white/60">
          <Skeleton active paragraph={{ rows: 2 }} />
        </Card>
      ))}
    </div>
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="!rounded-3xl !border-[#D8B894]/20 !bg-white/60">
          <Skeleton active paragraph={{ rows: 7 }} />
        </Card>
      ))}
    </div>
  </div>
);