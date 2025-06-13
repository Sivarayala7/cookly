import { useState, useEffect } from 'react';
import { MessageCircle, Reply, Trash2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import toast from 'react-hot-toast';

const CommentSection = ({ recipeId }) => {
  const { user, isAuthenticated } = useAuthStore();

  const [comments,   setComments]   = useState([]);
  const [newText,    setNewText]    = useState('');
  const [replyText,  setReplyText]  = useState('');
  const [replyingId, setReplyingId] = useState(null);
  const [busy,       setBusy]       = useState(false);

  /* ───── helpers ───── */
  const fmt = iso => {
    const d = new Date(iso);
    const diffM = Math.floor((Date.now() - d) / 60000);
    if (diffM < 1)  return 'just now';
    if (diffM < 60) return `${diffM}m ago`;
    const diffH = Math.floor(diffM / 60);
    if (diffH < 24) return `${diffH}h ago`;
    return d.toLocaleDateString();
  };

  const load = async () => {
    try {
      const { data } = await api.get(`/recipes/${recipeId}/comments`);
      setComments(data);
    } catch { setComments([]); }
  };

  useEffect(() => { load(); }, [recipeId]);

  /* ───── create comment ───── */
  const add = async e => {
    e.preventDefault();
    if (!newText.trim()) return;
    setBusy(true);
    try {
      const { data } = await api.post(`/recipes/${recipeId}/comments`, {
        content : newText.trim()
      });
      setComments(prev => [data, ...prev]);
      setNewText('');
    } catch { toast.error('Could not comment'); }
    finally { setBusy(false); }
  };

  /* ───── reply to comment ───── */
  const reply = async parentId => {
    if (!replyText.trim()) return;
    try {
      const { data } = await api.post(`/recipes/${recipeId}/comments`, {
        content : replyText.trim(),
        parentId
      });
      setComments(prev =>
        prev.map(c => c._id === parentId
          ? { ...c, replies : [...(c.replies || []), data] }
          : c
        )
      );
      setReplyText('');
      setReplyingId(null);
    } catch { toast.error('Could not reply'); }
  };

  /* ───── delete comment ───── */
  const remove = async (id, parentId) => {
    try {
      await api.delete(`/recipes/${recipeId}/comments/${id}`);
      setComments(prev => parentId
        ? prev.map(c => c._id === parentId
            ? { ...c, replies : c.replies.filter(r => r._id !== id) }
            : c
          )
        : prev.filter(c => c._id !== id)
      );
    } catch { toast.error('Delete failed'); }
  };

  /* ───── UI ───── */
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
      {/* header */}
      <div className="flex items-center mb-6 space-x-2">
        <MessageCircle className="text-green-primary" size={24} />
        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
          Comments ({comments.length})
        </h3>
      </div>

      {/* new comment box */}
      {isAuthenticated ? (
        <form onSubmit={add} className="mb-6 flex space-x-3">
          <div className="w-10 h-10 bg-green-primary rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <textarea
            value={newText}
            onChange={e => setNewText(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            className="flex-1 p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <button
            type="submit"
            disabled={!newText.trim() || busy}
            className="btn-primary p-2 rounded-full h-fit self-start"
          >
            Post
          </button>
        </form>
      ) : (
        <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
          Please log in to comment.
        </p>
      )}

      {/* comment list */}
      {comments.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400">No comments yet.</p>
      )}

      <div className="space-y-6">
        {comments.map(c => (
          <div key={c._id} className="border-b pb-4 last:border-b-0">
            {/* top-level comment */}
            <CommentItem
              c={c}
              canDelete={c.author._id === user?._id}
              onDelete={() => remove(c._id)}
              onStartReply={() => setReplyingId(c._id)}
              showReplyBox={replyingId === c._id}
              replyText={replyText}
              setReplyText={setReplyText}
              onSubmitReply={() => reply(c._id)}
              fmt={fmt}
            />

            {/* replies */}
            {c.replies?.map(r => (
              <CommentItem
                key={r._id}
                c={r}
                indent
                canDelete={r.author._id === user?._id}
                onDelete={() => remove(r._id, c._id)}
                fmt={fmt}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ────────────────────────────────────────────────────────────── */

const CommentItem = ({
  c,
  indent = false,
  canDelete,
  onDelete,
  onStartReply,
  showReplyBox,
  replyText,
  setReplyText,
  onSubmitReply,
  fmt
}) => (
  <div className={`flex space-x-3 ${indent ? 'ml-6 mt-4' : ''}`}>
    <div className={`rounded-full flex items-center justify-center
                     ${indent ? 'w-8 h-8 bg-gray-300' : 'w-10 h-10 bg-green-primary'}`}>
      <span className={indent ? 'text-gray-700 font-semibold text-sm'
                              : 'text-white font-semibold'}>
        {c.author.name.charAt(0).toUpperCase()}
      </span>
    </div>
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <div className="space-x-2">
          <span className="font-medium">{c.author.name}</span>
          <span className="text-sm text-gray-500">{fmt(c.createdAt)}</span>
        </div>
        {canDelete && (
          <button onClick={onDelete}>
            <Trash2 size={18} className="text-gray-500 hover:text-red-500" />
          </button>
        )}
      </div>

      <p className={`mt-1 ${indent ? 'text-sm' : ''}`}>{c.content}</p>

      {onStartReply && (
        <button
          onClick={onStartReply}
          className="mt-1 text-sm text-gray-500 hover:text-green-primary flex items-center space-x-1"
        >
          <Reply size={16} />
          <span>Reply</span>
        </button>
      )}

      {showReplyBox && (
        <div className="mt-2">
          <textarea
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            rows={2}
            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            placeholder="Write a reply..."
          />
          <div className="flex justify-end space-x-2 mt-1">
            <button
              onClick={() => { setReplyText(''); onStartReply(); }}
              className="px-3 py-1 text-gray-500 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={onSubmitReply}
              disabled={!replyText.trim()}
              className="btn-primary text-sm"
            >
              Reply
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default CommentSection;
