
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { Review } from '../types';

interface RatingChartProps {
  reviews: Review[];
}

const COLORS = ['#f87171', '#fb923c', '#fbbf24', '#a3e635', '#4ade80'];

export const RatingChart: React.FC<RatingChartProps> = ({ reviews }) => {
  const ratingCounts = [
    { name: '1 Star', count: 0 },
    { name: '2 Stars', count: 0 },
    { name: '3 Stars', count: 0 },
    { name: '4 Stars', count: 0 },
    { name: '5 Stars', count: 0 },
  ];

  reviews.forEach(review => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingCounts[review.rating - 1].count++;
    }
  });

  return (
    <div className="w-full h-64 mt-6">
      <ResponsiveContainer>
        <BarChart data={ratingCounts} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
          <XAxis type="number" allowDecimals={false} stroke="rgb(156 163 175)" />
          <YAxis type="category" dataKey="name" stroke="rgb(156 163 175)" width={60} />
          <Tooltip 
            cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}
            contentStyle={{ 
              backgroundColor: 'rgba(31, 41, 55, 0.8)', 
              borderColor: 'rgba(107, 114, 128, 0.5)',
              color: 'white'
            }} 
          />
          <Bar dataKey="count" background={{ fill: 'rgba(128, 128, 128, 0.1)' }}>
            {ratingCounts.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
