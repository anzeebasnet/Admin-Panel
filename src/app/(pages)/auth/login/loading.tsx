import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-8">
        <div className="flex flex-col gap-8">
          <Skeleton className="bg-[#cccccc] h-[80px] rounded-sm" />
          <Skeleton className="bg-[#cccccc] h-[260px] rounded-sm" />
        </div>
        <div>
          <Skeleton className="bg-[#cccccc] h-[380px] rounded-sm" />
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <Skeleton className="bg-[#cccccc] w-full h-[20px]  rounded-sm" />
        <Skeleton className="bg-[#cccccc] w-full h-[20px]  rounded-sm" />
        <Skeleton className="bg-[#cccccc] w-full h-[20px]  rounded-sm" />
      </div>
    </div>
  );
}
