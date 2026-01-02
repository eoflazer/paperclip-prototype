import React, { useState } from 'react';
import { ReadingItem, ReadingStatus } from '../types';
import { Badge } from './ui/Badge';
import { ExternalLink, CheckCircle, Clock, Archive, Trash2, Calendar, User, Globe, ChevronDown, ChevronUp } from 'lucide-react';

interface ReadingListProps {
  items: ReadingItem[];
  onUpdateStatus: (id: string, status: ReadingStatus) => void;
  onDelete: (id: string) => void;
}

interface ReadingListItemProps {
  item: ReadingItem;
  onUpdateStatus: (id: string, status: ReadingStatus) => void;
  onDelete: (id: string) => void;
}

const ReadingListItem: React.FC<ReadingListItemProps> = ({ item, onUpdateStatus, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Heuristic: if summary is longer than ~120 characters, show the toggle button
  const hasLongSummary = item.summary && item.summary.length > 120;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex flex-col h-full overflow-hidden">
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <Badge status={item.status} />
          <a 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-indigo-600 transition-colors p-1"
            title="Open original URL"
          >
            <ExternalLink className="h-5 w-5" />
          </a>
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight group-hover:text-indigo-700 transition-colors">
          {item.title}
        </h3>
        
        <div className="mb-4 flex-1">
          <p className={`text-sm text-slate-500 transition-all ${isExpanded ? '' : 'line-clamp-3'}`}>
            {item.summary || "No summary available."}
          </p>
          {hasLongSummary && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center text-xs font-medium text-indigo-600 hover:text-indigo-800 mt-2 focus:outline-none"
            >
              {isExpanded ? (
                <>Show less <ChevronUp className="h-3 w-3 ml-1" /></>
              ) : (
                <>Read more <ChevronDown className="h-3 w-3 ml-1" /></>
              )}
            </button>
          )}
        </div>

        <div className="flex items-center text-xs text-slate-400 gap-3 mb-1 flex-wrap mt-auto">
           <div className="flex items-center">
            <User className="h-3 w-3 mr-1" />
            <span className="truncate max-w-[100px]">{item.author}</span>
           </div>
           <div className="flex items-center">
            <Globe className="h-3 w-3 mr-1" />
            <span className="truncate max-w-[100px]">{item.siteName || new URL(item.url).hostname}</span>
           </div>
           <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{new Date(item.addedAt).toLocaleDateString()}</span>
           </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <div className="flex gap-2">
          {item.status !== ReadingStatus.READ && (
            <button
              onClick={() => onUpdateStatus(item.id, ReadingStatus.READ)}
              className="p-2 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
              title="Mark as Read"
            >
              <CheckCircle className="h-5 w-5" />
            </button>
          )}
          {item.status === ReadingStatus.READ && (
            <button
              onClick={() => onUpdateStatus(item.id, ReadingStatus.UNREAD)}
              className="p-2 text-green-600 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              title="Mark as Unread"
            >
              <Clock className="h-5 w-5" />
            </button>
          )}
          {item.status !== ReadingStatus.ARCHIVED && (
            <button
              onClick={() => onUpdateStatus(item.id, ReadingStatus.ARCHIVED)}
              className="p-2 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
              title="Archive"
            >
              <Archive className="h-5 w-5" />
            </button>
          )}
           {item.status === ReadingStatus.ARCHIVED && (
            <button
              onClick={() => onUpdateStatus(item.id, ReadingStatus.UNREAD)}
              className="p-2 text-orange-600 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              title="Unarchive"
            >
              <Clock className="h-5 w-5" />
            </button>
          )}
        </div>
        
        <button
          onClick={() => onDelete(item.id)}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
          title="Delete"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export const ReadingList: React.FC<ReadingListProps> = ({ items, onUpdateStatus, onDelete }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
        <div className="mx-auto h-12 w-12 text-slate-300">
          <Archive className="h-full w-full" />
        </div>
        <h3 className="mt-2 text-sm font-semibold text-slate-900">No items found</h3>
        <p className="mt-1 text-sm text-slate-500">Get started by adding a new URL above.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <ReadingListItem 
          key={item.id}
          item={item}
          onUpdateStatus={onUpdateStatus}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
