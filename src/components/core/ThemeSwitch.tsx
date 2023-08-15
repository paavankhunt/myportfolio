'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const getPreferredTheme = () => {
  let preferredTheme;
  if (typeof localStorage !== 'undefined') {
    preferredTheme = localStorage.getItem('preferredTheme');
  } else {
    preferredTheme = 'light';
  }
  return (
    preferredTheme ||
    (window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light')
  );
};

export const applyTheme = (theme: 'light' | 'dark') => {
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    root.classList.remove('light-theme', 'dark-theme');
    root.classList.add(`${theme}-theme`);
    localStorage.setItem('preferredTheme', theme);
  }
};

export default function ThemeSwitch() {
  const [currentTheme, setCurrentTheme] = useState(getPreferredTheme());

  useEffect(() => {
    applyTheme(currentTheme as 'light' | 'dark');
  }, [currentTheme]);

  const toggleTheme = useCallback(() => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    applyTheme(newTheme);
  }, [currentTheme, setCurrentTheme]);

  return (
    <div className="flex items-center">
      <div className="switch" onClick={(e) => toggleTheme()}>
        <input type="checkbox" />
        <span className="slider round"></span>
      </div>

      <style jsx>{`
        .flex {
          display: flex;
          align-items: center;
        }

        .moon-icon,
        .sun-icon {
          width: 18px;
          height: 18px;
          margin-right: 8px;
        }

        .moon-icon {
          fill: #fff;
        }

        .sun-icon {
          fill: #000;
        }

        .switch {
          position: relative;
          display: inline-block;
          width: 40px;
          height: 20px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: ${currentTheme === 'dark' ? '#000' : '#ccc'};
          transition: 0.4s;
          border-radius: 34px;
        }

        .slider:before {
          position: absolute;
          content: '';
          height: 16px;
          width: 16px;
          left: ${currentTheme === 'dark' ? '2px' : '22px'};
          bottom: 2px;
          background-color: ${currentTheme === 'dark' ? '#fff' : '#000'};
          transition: 0.4s;
          border-radius: 50%;
        }

        input:checked + .slider:before {
          transform: translateX(${currentTheme === 'dark' ? '20px' : '0'});
        }

        .slider.round {
          border-radius: 34px;
        }

        .slider.round:before {
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
}
