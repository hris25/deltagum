"use client";

import { motion } from "framer-motion";
import React from "react";
import { Skeleton } from "./Skeleton";

const ProductSkeleton: React.FC = () => {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Image skeleton */}
      <div className="relative h-64 bg-gradient-to-br from-pink-50 to-purple-50 p-6">
        <Skeleton className="w-full h-full rounded-xl" />
      </div>

      {/* Content skeleton */}
      <div className="p-6">
        {/* Badge skeleton */}
        <div className="text-center mb-4">
          <Skeleton className="inline-block h-6 w-24 rounded-full" />
        </div>

        {/* Title skeleton */}
        <Skeleton className="h-8 w-3/4 mx-auto mb-3" />

        {/* Description skeleton */}
        <div className="space-y-2 mb-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>

        {/* Price skeleton */}
        <div className="text-center mb-6">
          <Skeleton className="h-6 w-20 mx-auto" />
        </div>

        {/* Button skeleton */}
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </motion.div>
  );
};

const ProductGridSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {Array.from({ length: 2 }).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
};

export { ProductSkeleton, ProductGridSkeleton };
