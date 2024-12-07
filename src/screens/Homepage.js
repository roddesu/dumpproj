import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const Homepage = ({ navigation }) => {
  const [postText, setPostText] = useState('');
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);  // State to hold logged-in user's ID

  // Fetching posts when the component is mounted
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://192.168.0.181:3000/items');
        console.log('Fetched posts:', response.data);  // Log response to check if data is received
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    const getUserId = async () => {
      try {
        const loggedInUser = await AsyncStorage.getItem('loggedInUser');
        if (loggedInUser) {
          const user = JSON.parse(loggedInUser);
          setUserId(user.id);  // Store user ID after successful login
        } else {
          console.log('No user logged in');
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Error getting user info:', error);
      }
    };

    getUserId();
    fetchPosts();
  }, []); // Empty dependency array means this runs once after the component mounts

  // Handle the posting of new content
  const handlePost = async () => {
    if (!postText) {
      Alert.alert('Empty Post', 'Please write something to post.');
      return;
    }

    if (!userId) {
      Alert.alert('Not Logged In', 'Please log in to post.');
      return;
    }

    try {
      const response = await axios.post('http://192.168.0.181:3000/items', {
        user_id: userId,  // Use logged-in user's ID
        description: postText,
      });
      console.log('Posted new post:', response.data);  // Log response to check if post is successfully added
      setPosts([...posts, response.data]); // Add the newly posted data to the list
      setPostText(''); // Clear the input field
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };

  // Handle the logout action
  const handleLogout = () => {
    Alert.alert('Logged Out', 'You have logged out successfully.');
    AsyncStorage.removeItem('loggedInUser');  // Remove the user from AsyncStorage
    navigation.navigate('Login');
  };

  // Handle the reply action (navigate to comment page)
  const handleReply = (post) => {
    navigation.navigate('Comment', { post });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/bmc.png')} style={styles.logo} />
        <Text style={styles.appName}>SafeSpace</Text>
        <View style={styles.profileContainer}>
          <Text style={styles.profileName}>Anonymous</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.postContainer}>
        <TextInput
          style={styles.postInput}
          placeholder="What's on your mind?"
          value={postText}
          onChangeText={setPostText}
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.postButton} onPress={handlePost}>
          <Text style={styles.buttonText}>Post</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.newsContainer}>
        <Text style={styles.newsTitle}>News and Updates</Text>

        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <View style={styles.postCard}>
              <Text style={styles.postUser}>{item.user_id} • {item.created_at}</Text>
              <Text style={styles.postText}>{item.description}</Text>
              <Text style={styles.commentCount}>Comments: {item.comments ? item.comments.length : 0}</Text>
              <TouchableOpacity style={styles.replyButton} onPress={() => handleReply(item)}>
                <Text style={styles.replyButtonText}>Reply</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#757272',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4D1616',
    padding: 10,
    marginBottom: 20,
    marginTop: 10,
    marginHorizontal: -20,
  },
  logo: {
    width: 40,
    height: 40,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileName: {
    color: '#FFFFFF',
    marginRight: 10,
  },
  logoutText: {
    color: '#C43D3D',
  },
  postContainer: {
    marginBottom: 20,
  },
  postInput: {
    backgroundColor: '#FFFFFF',
    color: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  postButton: {
    backgroundColor: '#575757',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  newsContainer: {
    backgroundColor: '#4D1616',
    padding: 20,
    borderRadius: 10,
    marginBottom: 200,
  },
  newsTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 10,
  },
  postCard: {
    backgroundColor: '#4D1616',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  postUser: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  postText: {
    color: '#FFFFFF',
    marginTop: 10,
  },
  commentCount: {
    color: '#AAA',
    marginTop: 10,
  },
  replyButton: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  replyButtonText: {
    color: '#C43D3D',
  },
});

export default Homepage;
