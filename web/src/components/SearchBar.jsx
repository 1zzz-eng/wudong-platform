/**
 * 搜索组件
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({ placeholder = '搜索商品、美食、民宿...', onSearch = null, style = {} }) {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = keyword.trim();
    if (!trimmed) return;
    if (onSearch) {
      onSearch(trimmed);
    } else {
      navigate(`/search?keyword=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ ...styles.form, ...style }}>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder={placeholder}
        style={styles.input}
      />
      <button type="submit" style={styles.btn}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </button>
    </form>
  );
}

const styles = {
  form: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #d9d9d9',
    borderRadius: '20px',
    overflow: 'hidden',
    backgroundColor: '#fff',
    transition: 'border-color 0.3s',
  },
  input: {
    flex: 1,
    border: 'none',
    outline: 'none',
    padding: '8px 16px',
    fontSize: '14px',
    minWidth: '200px',
    backgroundColor: 'transparent',
  },
  btn: {
    border: 'none',
    backgroundColor: 'transparent',
    padding: '8px 14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#999',
  },
};
