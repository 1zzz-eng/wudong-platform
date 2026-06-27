/**
 * 社区游记列表页 - Tab切换(推荐/最新) + 搜索话题 + 分页 + 网格瀑布流
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getCommunityList } from '../../api/index';
import { mockPosts } from '../../api/mockData';
import Loading from '../../components/Loading';
import Empty from '../../components/Empty';
import ErrorMessage from '../../components/ErrorMessage';

export default function CommunityList() {
  const [posts, setPosts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState('recommend'); // recommend / latest
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getCommunityList();
      if (res && res.data && res.data.length > 0) {
        setPosts(res.data);
      } else {
        setPosts(mockPosts);
      }
    } catch {
      setPosts(mockPosts);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // 排序 + 搜索筛选
  useEffect(() => {
    let list = [...posts];

    // Tab 排序：推荐按点赞数降序，最新按时间降序
    if (activeTab === 'recommend') {
      list.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
    } else {
      list.sort((a, b) => {
        const dateA = new Date(a.createTime || a.created_at || 0);
        const dateB = new Date(b.createTime || b.created_at || 0);
        return dateB - dateA;
      });
    }

    // 关键词搜索（标题和摘要）
    if (keyword.trim()) {
      const kw = keyword.toLowerCase();
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(kw) ||
          p.summary?.toLowerCase().includes(kw)
      );
    }

    setFiltered(list);
    setPage(1);
  }, [posts, activeTab, keyword]);

  // 分页
  const totalPages = Math.ceil(filtered.length / pageSize);
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <h2 style={pageStyles.title}>社区分享</h2>
      <p style={pageStyles.subtitle}>发现乌东之美，分享你的旅行故事</p>

      {/* 工具栏：Tab + 搜索 */}
      <div style={pageStyles.toolbar}>
        <div style={pageStyles.tabs}>
          <button
            onClick={() => setActiveTab('recommend')}
            style={{
              ...pageStyles.tab,
              ...(activeTab === 'recommend' ? pageStyles.tabActive : {}),
            }}
          >
            推荐
          </button>
          <button
            onClick={() => setActiveTab('latest')}
            style={{
              ...pageStyles.tab,
              ...(activeTab === 'latest' ? pageStyles.tabActive : {}),
            }}
          >
            最新
          </button>
        </div>
        <input
          type="text"
          placeholder="搜索话题..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={pageStyles.searchInput}
        />
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorMessage onRetry={fetchPosts} />
      ) : pageData.length === 0 ? (
        <Empty title="暂无游记" description="快来分享第一篇游记吧" />
      ) : (
        <>
          {/* 游记卡片网格 */}
          <div style={pageStyles.grid}>
            {pageData.map((post) => (
              <Link to={`/community/${post.id}`} key={post.id} style={pageStyles.card}>
                <div style={pageStyles.imageWrap}>
                  <img
                    src={post.images?.[0] || post.cover || post.image}
                    alt={post.title}
                    style={pageStyles.image}
                    onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                  />
                </div>
                <div style={pageStyles.cardInfo}>
                  <h3 style={pageStyles.cardTitle}>{post.title}</h3>
                  <p style={pageStyles.summary}>{post.summary || '暂无摘要'}</p>
                  <div style={pageStyles.metaRow}>
                    <div style={pageStyles.author}>
                      {post.author?.avatar ? (
                        <img src={post.author.avatar} alt="" style={pageStyles.avatar} />
                      ) : (
                        <span style={pageStyles.avatarPlaceholder}>👤</span>
                      )}
                      <span>{post.author?.name || '匿名用户'}</span>
                    </div>
                    <div style={pageStyles.stats}>
                      <span>❤ {post.likeCount || 0}</span>
                      <span>💬 {post.commentCount || post.comments?.length || 0}</span>
                      <span style={pageStyles.time}>
                        {post.createTime || post.created_at || ''}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* 分页器 */}
          {totalPages > 1 && (
            <div style={pageStyles.pagination}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  ...pageStyles.pageBtn,
                  ...(page === 1 ? pageStyles.pageBtnDisabled : {}),
                }}
              >
                上一页
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  style={{
                    ...pageStyles.pageBtn,
                    ...(page === i + 1 ? pageStyles.pageBtnActive : {}),
                  }}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{
                  ...pageStyles.pageBtn,
                  ...(page === totalPages ? pageStyles.pageBtnDisabled : {}),
                }}
              >
                下一页
              </button>
              <span style={pageStyles.pageInfo}>共 {filtered.length} 篇游记</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const pageStyles = {
  title: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#333',
    margin: '0 0 6px',
    paddingLeft: '4px',
    borderLeft: '4px solid var(--primary-color)',
    padding: '4px 0 4px 12px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#999',
    margin: '0 0 20px',
    paddingLeft: '20px',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '20px',
  },
  tabs: {
    display: 'flex',
    gap: '0',
  },
  tab: {
    padding: '10px 28px',
    fontSize: '15px',
    border: 'none',
    backgroundColor: '#fff',
    color: '#666',
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    transition: 'all 0.2s',
  },
  tabActive: {
    color: 'var(--primary-color)',
    fontWeight: 600,
    borderBottomColor: 'var(--primary-color)',
  },
  searchInput: {
    padding: '8px 16px',
    border: '1px solid #d9d9d9',
    borderRadius: '20px',
    fontSize: '13px',
    outline: 'none',
    width: '220px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    textDecoration: 'none',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  imageWrap: {
    width: '100%',
    height: '200px',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  cardInfo: {
    padding: '16px 18px',
  },
  cardTitle: {
    fontSize: '17px',
    fontWeight: 600,
    color: '#333',
    margin: '0 0 8px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  summary: {
    fontSize: '13px',
    color: '#888',
    lineHeight: 1.5,
    margin: '0 0 14px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#666',
  },
  avatar: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  avatarPlaceholder: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
  },
  stats: {
    display: 'flex',
    gap: '10px',
    fontSize: '12px',
    color: '#bbb',
    alignItems: 'center',
  },
  time: {
    fontSize: '12px',
    color: '#bbb',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '6px',
    marginTop: '32px',
    flexWrap: 'wrap',
  },
  pageBtn: {
    padding: '6px 14px',
    border: '1px solid #d9d9d9',
    borderRadius: '6px',
    backgroundColor: '#fff',
    color: '#666',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  pageBtnActive: {
    backgroundColor: 'var(--primary-color)',
    color: '#fff',
    borderColor: 'var(--primary-color)',
  },
  pageBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  pageInfo: {
    fontSize: '13px',
    color: '#999',
    marginLeft: '12px',
  },
};
