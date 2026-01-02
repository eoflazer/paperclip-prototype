import React, { useState, useEffect } from 'react';
import { ReadingItem, ReadingStatus, AddItemResponse } from './types';
import { AddItemForm } from './components/AddItemForm';
import { ReadingList } from './components/ReadingList';
import { BookOpen, Layers, CheckSquare, Archive as ArchiveIcon, Paperclip } from 'lucide-react';

const App: React.FC = () => {
  const [items, setItems] = useState<ReadingItem[]>(() => {
    // Check for old data to migrate or just start fresh with new key
    const saved = localStorage.getItem('paperclip_items') || localStorage.getItem('readflow_items');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState<ReadingStatus | 'ALL'>('ALL');

  useEffect(() => {
    localStorage.setItem('paperclip_items', JSON.stringify(items));
  }, [items]);

  const handleAddItem = (url: string, metadata: AddItemResponse) => {
    const newItem: ReadingItem = {
      id: crypto.randomUUID(),
      url,
      title: metadata.title,
      author: metadata.author,
      siteName: metadata.siteName,
      summary: metadata.summary,
      addedAt: new Date().toISOString(),
      status: ReadingStatus.UNREAD,
    };
    setItems(prev => [newItem, ...prev]);
  };

  const handleUpdateStatus = (id: string, status: ReadingStatus) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, status } : item
    ));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const filteredItems = items.filter(item => {
    if (activeTab === 'ALL') return item.status !== ReadingStatus.ARCHIVED;
    return item.status === activeTab;
  });

  const stats = {
    unread: items.filter(i => i.status === ReadingStatus.UNREAD).length,
    read: items.filter(i => i.status === ReadingStatus.READ).length,
    archived: items.filter(i => i.status === ReadingStatus.ARCHIVED).length,
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Paperclip className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                Paperclip
              </h1>
            </div>
            <div className="text-sm text-slate-500 hidden sm:block">
              {stats.unread} unread articles
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="text-center mb-10 mt-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Add to your reading list</h2>
        </div>

        <AddItemForm onAdd={handleAddItem} />

        {/* Filters */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'ALL' 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Layers className="h-4 w-4 mr-2" />
              Active
            </button>
            <button
              onClick={() => setActiveTab(ReadingStatus.UNREAD)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === ReadingStatus.UNREAD
                  ? 'bg-blue-50 text-blue-700 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Unread
              <span className="ml-2 bg-slate-100 text-slate-600 py-0.5 px-2 rounded-full text-xs">
                {stats.unread}
              </span>
            </button>
            <button
              onClick={() => setActiveTab(ReadingStatus.READ)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === ReadingStatus.READ
                  ? 'bg-green-50 text-green-700 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <CheckSquare className="h-4 w-4 mr-2" />
              Read
              <span className="ml-2 bg-slate-100 text-slate-600 py-0.5 px-2 rounded-full text-xs">
                {stats.read}
              </span>
            </button>
            <button
              onClick={() => setActiveTab(ReadingStatus.ARCHIVED)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === ReadingStatus.ARCHIVED
                  ? 'bg-gray-100 text-gray-700 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ArchiveIcon className="h-4 w-4 mr-2" />
              Archived
              <span className="ml-2 bg-slate-100 text-slate-600 py-0.5 px-2 rounded-full text-xs">
                {stats.archived}
              </span>
            </button>
          </div>
        </div>

        <ReadingList 
          items={filteredItems} 
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
};

export default App;