"use client";

import { Card, CardContent } from "@/components/ui";
import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  growth?: number;
  onClick?: () => void;
  delay?: number;
}

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  growth, 
  onClick,
  delay = 0 
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -2 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">
                {title}
              </p>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {value}
              </p>
              {growth !== undefined && (
                <div className="flex items-center">
                  {growth >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    growth >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                  </span>
                  <span className="text-xs text-gray-500 ml-1">vs mois dernier</span>
                </div>
              )}
            </div>
            <div className={`p-4 rounded-xl ${color} shadow-lg`}>
              <Icon className="w-7 h-7 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
