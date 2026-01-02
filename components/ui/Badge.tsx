import React from 'react';
import { ReadingStatus } from '../../types';

interface BadgeProps {
  status: ReadingStatus;
}

const statusStyles = {
  [ReadingStatus.UNREAD]: 'bg-blue-100 text-blue-800 border-blue-200',
  [ReadingStatus.READ]: 'bg-green-100 text-green-800 border-green-200',
  [ReadingStatus.ARCHIVED]: 'bg-gray-100 text-gray-800 border-gray-200',
};

const statusLabels = {
  [ReadingStatus.UNREAD]: 'Unread',
  [ReadingStatus.READ]: 'Read',
  [ReadingStatus.ARCHIVED]: 'Archived',
};

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status]}`}>
      {statusLabels[status]}
    </span>
  );
};
