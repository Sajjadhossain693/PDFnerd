import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ToolCard from '../components/ui/ToolCard';
import { ALL_TOOLS, TOOL_CATEGORIES } from '../data/tools';

export default function AllTools() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredTools = useMemo(() => {
    return ALL_TOOLS.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.description.toLowerCase().includes(query.toLowerCase());
      const matchesCat =
        activeCategory === 'all'
          ? true
          : activeCategory === 'popular'
          ? t.badge === 'Popular'
          : t.category === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [query, activeCategory]);

  return (
    <div className="min-h-screen py-12 bg-forest-grid">
      <div className="section-container">
        
        {/* Header Banner */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="alert-green-badge mb-2">
            <i className="bi bi-grid-fill"></i> Complete Arsenal
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
            All PDF Tools in One Place
          </h1>
          <p className="text-xs sm:text-sm text-forest-textMuted mt-2">
            Every tool is completely free, secure, and running directly in memory with care and precision.
          </p>

          {/* Search bar */}
          <div className="relative max-w-lg mx-auto mt-6">
            <i className="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-forest-textMuted"></i>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search across all 26 tools..."
              className="spark-input pl-11 pr-4 py-3 text-xs"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-forest-textMuted hover:text-white text-xs"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Switcher Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              activeCategory === 'all'
                ? 'bg-lime-accent text-forest-canvas border-lime-accent shadow-lime-glow'
                : 'bg-forest-card text-forest-textMuted border-forest-border hover:text-white'
            }`}
          >
            All Utilities ({ALL_TOOLS.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('popular')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              activeCategory === 'popular'
                ? 'bg-lime-accent text-forest-canvas border-lime-accent shadow-lime-glow'
                : 'bg-forest-card text-forest-textMuted border-forest-border hover:text-white'
            }`}
          >
            ⚡ Most Popular
          </button>
          {TOOL_CATEGORIES.map((cat) => (
            <button
              key={cat.title}
              type="button"
              onClick={() => setActiveCategory(cat.tools[0]?.category)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                activeCategory === cat.tools[0]?.category
                  ? 'bg-lime-accent text-forest-canvas border-lime-accent shadow-lime-glow'
                  : 'bg-forest-card text-forest-textMuted border-forest-border hover:text-white'
              }`}
            >
              <i className={`bi ${cat.icon}`}></i>
              <span>{cat.title}</span>
            </button>
          ))}
        </div>

        {/* Tools Results Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="spark-card p-12 text-center max-w-md mx-auto">
            <i className="bi bi-search text-3xl text-forest-textMuted block mb-3"></i>
            <h3 className="text-white font-bold text-base mb-1">No tools match your filter</h3>
            <p className="text-forest-textMuted text-xs mb-4">
              Try a different keyword or reset the category filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setActiveCategory('all');
              }}
              className="btn-lime text-xs py-2 px-4"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
