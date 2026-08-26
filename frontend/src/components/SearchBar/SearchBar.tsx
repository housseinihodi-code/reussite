import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  initialValue?: string;
  placeholder?: string;
}

export function SearchBar({ initialValue = '', placeholder = 'Rechercher une marque, un modèle…' }: SearchBarProps) {
  const [value, setValue] = useState(initialValue);
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    navigate(`/vehicles?q=${encodeURIComponent(value.trim())}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
      <div className="relative flex-1">
        <svg
          viewBox="0 0 24 24"
          className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 fill-none stroke-slate-400"
          strokeWidth={2}
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          className="h-12 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
      </div>
      <button
        type="submit"
        className="h-12 rounded-lg bg-primary-600 px-6 text-sm font-semibold text-white hover:bg-primary-700"
      >
        Rechercher
      </button>
    </form>
  );
}
