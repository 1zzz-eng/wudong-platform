/**
 * 游记详情页 - 大图 + 全文内容 + 话题标签 + 点赞/收藏/分享 + 评论（支持回复）
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCommunityDetail, getCommunityComments } from '../../api/index';
import { mockPosts } from '../../api/mockData';
import Loading from '../../components/Loading';
import Empty from '../../components/Empty';
import ErrorMessage from '../../components/ErrorMessage';

export default function CommunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [collected, setCollected] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState(null); // { commentId, userName }
  const [shareMsg, setShareMsg] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getCommunityDetail(id);
      if (res && res.data) {
        setPost(res.data);
        setLiked(res.data.liked || false);
        setLikeCount(res.data.likeCount || 0);
        setCollected(res.data.collected || false);
      } else {
        const found = mockPosts.find((p) => p.id === Number(id));
        if (found) {
          setPost(found);
          setLiked(found.liked || false);
          setLikeCount(found.likeCount || 0);
        } else setError(true);
      }
    } catch {
      const found = mockPosts.find((p) => p.id === Number(id));
      if (found) {
        setPost(found);
        setLiked(found.liked || false);
        setLikeCount(found.likeCount || 0);
      } else setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
    window.scrollTo(0, 0);
  }, [fetchData]);

  // 点赞切换
  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
  };

  // 收藏切换
  const handleCollect = () => {
    setCollected((prev) => !prev);
  };

  // 分享（复制链接）
  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setShareMsg('链接已复制到剪贴板');
        setTimeout(() => setShareMsg(''), 2000);
      });
    } else {
      setShareMsg('分享链接：' + url);
      setTimeout(() => setShareMsg(''), 3000);
    }
  };

  // 发布评论 / 回复
  const handleComment = () => {
    if (!commentText.trim()) return;
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    // 模拟发布评论
    setCommentText('');
    setReplyTo(null);
  };

  // 设置回复对象
  const handleReply = (commentId, userName) => {
    setReplyTo({ commentId, userName });
    setCommentText(`@${userName} `);
  };

  if (loading) return <Loading />;
  if (error || !post) return <ErrorMessage message="游记未找到" onRetry={fetchData} />;

  return (
    <div style={styles.container}>
      {/* 面包屑 */}
      <div style={styles.breadcrumb}>
        <span style={styles.breadLink} onClick={() => navigate('/')}>首页</span>
        <span> / </span>
        <span style={styles.breadLink} onClick={() => navigate('/community')}>社区分享</span>
        <span> / </span>
        <span>{post.title}</span>
      </div>

      {/* 标题 */}
      <h1 style={styles.title}>{post.title}</h1>

      {/* 作者信息 */}
      <div style={styles.authorRow}>
        {post.author?.avatar ? (
          <img src={post.author.avatar} alt="" style={styles.avatar} />
        ) : (
          <span style={styles.avatarPlaceholder}>👤</span>
        )}
        <div>
          <span style={styles.authorName}>{post.author?.name || '匿名用户'}</span>
          <span style={styles.date}>{post.createTime || post.created_at}</span>
        </div>
        <div style={styles.stats}>
          <span>👁 {post.viewCount || 0}</span>
          <span>💬 {post.commentCount || post.comments?.length || 0}</span>
        </div>
      </div>

      {/* 话题标签 */}
      {post.tags && post.tags.length > 0 && (
        <div style={styles.tagsWrap}>
          {post.tags.map((tag, i) => (
            <span key={i} style={styles.tag}>#{tag}</span>
          ))}
        </div>
      )}

      {/* 封面大图 */}
      {post.images?.[0] && (
        <div style={styles.coverWrap}>
          <img
            src={post.images[0]}
            alt={post.title}
            style={styles.coverImage}
            onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
          />
        </div>
      )}

      {/* 正文 */}
      <div style={styles.content}>
        {post.content?.split('\n').map((para, i) => (
          <p key={i} style={styles.paragraph}>{para}</p>
        ))}
      </div>

      {/* 图片集 */}
      {post.images && post.images.length > 1 && (
        <div style={styles.imagesGrid}>
          {post.images.slice(1).map((img, i) => (
            <img key={i} src={img} alt="" style={styles.contentImage} />
          ))}
        </div>
      )}

      {/* 操作栏：点赞 / 收藏 / 分享 */}
      <div style={styles.actions}>
        <button onClick={handleLike} style={{ ...styles.actionBtn, color: liked ? '#E74C3C' : '#666' }}>
          {liked ? '❤' : '🤍'} 点赞 {likeCount}
        </button>
        <button onClick={handleCollect} style={{ ...styles.actionBtn, color: collected ? '#D4A14B' : '#666' }}>
          {collected ? '★' : '☆'} 收藏
        </button>
        <button onClick={handleShare} style={{ ...styles.actionBtn, color: '#666' }}>
          ↗ 分享
        </button>
        {shareMsg && <span style={styles.shareMsg}>{shareMsg}</span>}
      </div>

      {/* 评论区 */}
      <div style={styles.commentsSection}>
        <h3 style={styles.sectionTitle}>
          评论 ({post.comments?.length || 0})
        </h3>

        {/* 发布评论 */}
        <div style={styles.commentForm}>
          {replyTo && (
            <div style={styles.replyHint}>
              回复 @{replyTo.userName}
              <button onClick={() => { setReplyTo(null); setCommentText(''); }} style={styles.cancelReply}>取消</button>
            </div>
          )}
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={replyTo ? `回复 @${replyTo.userName}...` : '写下你的评论...'}
            style={styles.commentInput}
            rows={3}
          />
          <button onClick={handleComment} style={styles.commentBtn}>发布</button>
        </div>

        {/* 评论列表 */}
        {post.comments && post.comments.length > 0 ? (
          <div>
            {post.comments.map((cmt) => (
              <div key={cmt.id} style={styles.commentCard}>
                <div style={styles.commentHeader}>
                  <span style={styles.commentUser}>
                    {cmt.user?.name || cmt.user || '用户'}
                  </span>
                  <span style={styles.commentTime}>{cmt.time || cmt.createTime}</span>
                </div>
                <p style={styles.commentContent}>{cmt.content}</p>
                <div style={styles.commentActions}>
                  <span style={styles.commentLike}>👍 {cmt.likeCount || 0}</span>
                  <button
                    onClick={() => handleReply(cmt.id, cmt.user?.name || cmt.user)}
                    style={styles.replyBtn}
                  >
                    回复
                  </button>
                </div>

                {/* 二级回复 */}
                {cmt.replies && cmt.replies.length > 0 && (
                  <div style={styles.repliesWrap}>
                    {cmt.replies.map((reply, ri) => (
                      <div key={reply.id || ri} style={styles.replyCard}>
                        <span style={styles.replyUser}>
                          {reply.user?.name || reply.user || '用户'}
                        </span>
                        <span style={styles.replyText}>{reply.content}</span>
                        <span style={styles.replyTime}>{reply.time || ''}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <Empty title="暂无评论" description="快来发表第一条评论吧" />
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '32px',
    lineHeight: 1.8,
  },
  breadcrumb: {
    fontSize: '13px',
    color: '#999',
    marginBottom: '20px',
  },
  breadLink: {
    cursor: 'pointer',
    color: '#999',
  },
  title: {
    fontSize: '26px',
    fontWeight: 700,
    color: '#333',
    margin: '0 0 16px',
    lineHeight: 1.4,
  },
  authorRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    paddingBottom: '16px',
    borderBottom: '1px solid #f0f0f0',
    marginBottom: '16px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  avatarPlaceholder: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  authorName: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 500,
    color: '#333',
  },
  date: {
    fontSize: '12px',
    color: '#bbb',
  },
  stats: {
    marginLeft: 'auto',
    display: 'flex',
    gap: '16px',
    fontSize: '13px',
    color: '#999',
  },
  tagsWrap: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '20px',
  },
  tag: {
    fontSize: '12px',
    color: 'var(--primary-color)',
    backgroundColor: 'rgba(31,95,168,0.08)',
    padding: '3px 10px',
    borderRadius: '12px',
  },
  coverWrap: {
    marginBottom: '24px',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    maxHeight: '500px',
    objectFit: 'cover',
  },
  content: {
    marginBottom: '24px',
  },
  paragraph: {
    fontSize: '15px',
    color: '#444',
    lineHeight: 2,
    margin: '0 0 16px',
  },
  imagesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '12px',
    marginBottom: '24px',
  },
  contentImage: {
    width: '100%',
    borderRadius: '8px',
    objectFit: 'cover',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    padding: '20px 0',
    borderTop: '1px solid #f0f0f0',
    borderBottom: '1px solid #f0f0f0',
    marginBottom: '30px',
    flexWrap: 'wrap',
  },
  actionBtn: {
    fontSize: '15px',
    border: '1px solid #e8e8e8',
    padding: '10px 28px',
    borderRadius: '24px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  shareMsg: {
    fontSize: '13px',
    color: '#27AE60',
  },
  commentsSection: {},
  sectionTitle: {
    fontSize: '17px',
    fontWeight: 600,
    color: '#333',
    margin: '0 0 16px',
  },
  commentForm: {
    marginBottom: '24px',
  },
  replyHint: {
    fontSize: '13px',
    color: 'var(--primary-color)',
    backgroundColor: 'rgba(31,95,168,0.05)',
    padding: '6px 12px',
    borderRadius: '6px',
    marginBottom: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelReply: {
    fontSize: '12px',
    color: '#999',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  commentInput: {
    width: '100%',
    padding: '12px',
    border: '1px solid #d9d9d9',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  commentBtn: {
    marginTop: '10px',
    padding: '8px 24px',
    fontSize: '14px',
    color: '#fff',
    backgroundColor: 'var(--primary-color)',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  commentCard: {
    padding: '14px 0',
    borderBottom: '1px solid #f0f0f0',
  },
  commentHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '6px',
  },
  commentUser: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#333',
  },
  commentTime: {
    fontSize: '12px',
    color: '#bbb',
  },
  commentContent: {
    fontSize: '14px',
    color: '#666',
    lineHeight: 1.6,
    margin: '0 0 6px',
  },
  commentActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  commentLike: {
    fontSize: '12px',
    color: '#999',
    cursor: 'pointer',
  },
  replyBtn: {
    fontSize: '12px',
    color: '#999',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  },
  repliesWrap: {
    marginTop: '10px',
    marginLeft: '20px',
    padding: '10px 14px',
    backgroundColor: '#fafafa',
    borderRadius: '8px',
  },
  replyCard: {
    padding: '6px 0',
    fontSize: '13px',
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  replyUser: {
    color: 'var(--primary-color)',
    fontWeight: 500,
  },
  replyText: {
    color: '#666',
    flex: 1,
  },
  replyTime: {
    color: '#bbb',
    fontSize: '11px',
  },
};
