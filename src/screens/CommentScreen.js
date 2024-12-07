import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const CommentScreen = ({ route, navigation }) => {
  const { post } = route.params;
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(post.comments || []);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://192.168.0.181:3000/posts/${post.id}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [post.id]);

  const handleCommentPost = async () => {
    if (!commentText) {
      Alert.alert('Empty Comment', 'Please write something to post.');
      return;
    }

    try {
      const response = await axios.post(`http://192.168.0.181:3000/posts/${post.id}/comments`, {
        text: commentText,
      });
      setComments([...comments, response.data]);
      setCommentText(''); // Clear input after posting
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <Ionicons name="close" size={24} color="#fff" />
      </TouchableOpacity>
      <FlatList
        data={comments}
        renderItem={({ item }) => (
          <View style={styles.commentCard}>
            <Text style={styles.commentText}>{item.text}</Text>
            <View style={styles.commentFooter}>
              <Text style={styles.commentTime}>Anonymous {new Date(item.created_at).toLocaleDateString()}</Text>
              <TouchableOpacity>
                <Text style={styles.likeIcon}>♥</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={() => (
          <View style={styles.postSection}>
            <Text style={styles.postText}>{post.description}</Text>
            <Text style={styles.commentCount}>{comments.length} Comments</Text>
          </View>
        )}
      />
      <View style={styles.commentInputSection}>
        <TextInput
          style={styles.commentInput}
          placeholder="Write a comment..."
          value={commentText}
          onChangeText={setCommentText}
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.commentButton} onPress={handleCommentPost}>
          <Text style={styles.buttonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4D1616',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  postSection: {
    padding: 20,
    backgroundColor: '#4D1616',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginTop: 60,
  },
  postText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
  commentCount: {
    color: '#aaa',
  },
  commentInputSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#444',
    borderTopWidth: 1,
    borderColor: '#555',
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
  },
  commentButton: {
    backgroundColor: '#757272',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  commentCard: {
    backgroundColor: '#757272',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 20,
  },
  commentText: {
    color: '#fff',
    marginBottom: 10,
  },
  commentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentTime: {
    color: '#aaa',
  },
  likeIcon: {
    color: '#e63946',
  },
});

export default CommentScreen;