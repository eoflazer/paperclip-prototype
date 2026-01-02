import React, { useState } from 'react';
import { extractMetadata } from '../services/geminiService';
import { AddItemResponse } from '../types';
import { Plus, Loader2, Link as LinkIcon, AlertCircle } from 'lucide-react';

interface AddItemFormProps {
  onAdd: (url: string, metadata: AddItemResponse) => void;
}

export const AddItemForm: React.FC<AddItemFormProps> = ({ onAdd }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    // Basic URL validation
    try {
      new URL(url);
    } catch (_) {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const metadata = await extractMetadata(url);
      onAdd(url, metadata);
      setUrl('');
    } catch (err) {
      setError('Failed to fetch metadata. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <LinkIcon className="h-5 w-5" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Paste a URL to add to your reading list..."
            className="block w-full pl-11 pr-32 py-4 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all duration-200 text-lg"
            disabled={isLoading}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className={`flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isLoading || !url.trim()
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 mr-1" />
                  <span>Add Article</span>
                </>
              )}
            </button>
          </div>
        </div>
        {error && (
          <div className="absolute -bottom-8 left-0 flex items-center text-red-500 text-sm animate-fadeIn">
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </div>
        )}
      </form>
    </div>
  );
};
