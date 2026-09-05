import { useState } from 'react';
import ToolCard from '../ui/ToolCard';
import { ALL_TOOLS, TOOL_CATEGORIES } from '../../data/tools';

export default function ToolsGrid() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredTools =
    activeCategory === 'all'
      ? ALL_TOOLS
      : activeCategory === 'popular'
      ? ALL_TOOLS.filter((t) => t.badge === 'Popular')
      : ALL_TOOLS.filter((t) => t.category === activeCategory);

  return (
    <section className="py-16 bg-[#07090E]" id="tools-section">
      <div className="section-container">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">
                Full Utility Catalog
              </span>
              <span className="text-zinc-700">•</span>
              <span className="text-xs text-zinc-400 font-semibold">{ALL_TOOLS.length} Ready Tools</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Explore PDF Tools by Category
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#0D111C] border border-[#1E2638] rounded-2xl p-1.5 shadow-lg">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeCategory === 'all'
                  ? 'bg-[#1E2638] text-white shadow-sm border border-white/10'
                  : 'text-zinc-400 hover:text-white hover:bg-[#131926]'
              }`}
            >
              All Tools ({ALL_TOOLS.length})
            </button>
            <button
              onClick={() => setActiveCategory('popular')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeCategory === 'popular'
                  ? 'bg-[#1E2638] text-white shadow-sm border border-white/10'
                  : 'text-zinc-400 hover:text-white hover:bg-[#131926]'
              }`}
            >
              ⚡ Popular
            </button>
            {TOOL_CATEGORIES.map((cat) => (
              <button
                key={cat.title}
                onClick={() => setActiveCategory(cat.tools[0]?.category)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeCategory === cat.tools[0]?.category
                    ? 'bg-[#1E2638] text-white shadow-sm border border-white/10'
                    : 'text-zinc-400 hover:text-white hover:bg-[#131926]'
                }`}
              >
                <i className={`bi ${cat.icon}`}></i>
                <span>{cat.title.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

      </div>
    </section>
  );
}
