import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const CommentSection = ({ entityId, entityType }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      const commentsRef = collection(db, entityType, entityId, 'comments');
      const commentDocs = await getDocs(commentsRef);
      const loadedComments = commentDocs.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(loadedComments);
    };

    fetchComments();
  }, [entityId, entityType]);

  const handleAddComment = async () => {
    if (newComment.trim() && user) {
      const commentData = {
        username: user.username || 'Guest',
        email: user.email || 'guest@example.com',
        userId: user.uid,
        text: newComment.trim(),
        timestamp: new Date(),
      };
      const commentsRef = collection(db, entityType, entityId, 'comments');
      const docRef = await addDoc(commentsRef, commentData);
      setComments(prevComments => [
        ...prevComments,
        { id: docRef.id, ...commentData },
      ]);
      setNewComment('');
    } else {
      alert('Vui lòng đăng nhập để bình luận!');
    }
  };

  const handleEditComment = async (commentId, newText) => {
    const comment = comments.find(c => c.id === commentId);
    if (comment.userId === user.uid) {
      const commentRef = doc(db, entityType, entityId, 'comments', commentId);
      await updateDoc(commentRef, { text: newText });
      setComments(prevComments =>
        prevComments.map(c => (c.id === commentId ? { ...c, text: newText } : c))
      );
    } else {
      alert('Bạn chỉ có thể sửa bình luận của mình.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    const comment = comments.find(c => c.id === commentId);
    if (comment.userId === user.uid) {
      const commentRef = doc(db, entityType, entityId, 'comments', commentId);
      await deleteDoc(commentRef);
      setComments(prevComments => prevComments.filter(c => c.id !== commentId));
    } else {
      alert('Bạn chỉ có thể xóa bình luận của mình.');
    }
  };

  const formatDate = (timestamp) => {
    const date = timestamp && timestamp.toDate ? timestamp.toDate() : timestamp;
    return new Intl.DateTimeFormat('vi-VN', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-gray-900">Bình luận</h3>
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="p-4 bg-gray-100 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{comment.username}</p>
                  <p className="text-sm text-gray-500">{comment.email}</p>
                </div>
                <p className="text-sm text-gray-500">{formatDate(comment.timestamp)}</p>
              </div>
              <p className="text-gray-800 mt-2">{comment.text}</p>
              {comment.userId === user?.uid && (
                <div className="flex space-x-2 mt-2">
                  <button
                    className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                    onClick={() => {
                      const newText = prompt('Chỉnh sửa bình luận:', comment.text);
                      if (newText) handleEditComment(comment.id, newText);
                    }}
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    Xóa
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <div>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Thêm bình luận của bạn..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          className="mt-3 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-all duration-300"
          onClick={handleAddComment}
        >
          Gửi bình luận
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
