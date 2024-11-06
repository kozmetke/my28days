import Notification from '@/models/notification';

export async function createNotification({
  recipientId,
  senderId,
  type,
  postId,
  comment,
}: {
  recipientId: string;
  senderId: string;
  type: 'like' | 'comment' | 'follow';
  postId?: string;
  comment?: string;
}) {
  // Don't create notification if sender is recipient
  if (recipientId === senderId) {
    return;
  }

  try {
    const notification = new Notification({
      recipient: recipientId,
      sender: senderId,
      type,
      ...(postId && { post: postId }),
      ...(comment && { comment }),
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

export async function getUnreadNotificationsCount(userId: string) {
  try {
    const count = await Notification.countDocuments({
      recipient: userId,
      read: false,
    });
    return count;
  } catch (error) {
    console.error('Error counting unread notifications:', error);
    return 0;
  }
}
