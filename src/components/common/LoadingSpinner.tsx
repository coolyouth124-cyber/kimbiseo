'use client';

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-white animate-spin"
        ></div>
      </div>
    </div>
  );
}
