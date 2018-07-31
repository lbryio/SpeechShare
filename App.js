import React from 'react';
import {
  ActivityIndicator,
  Linking,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';

export default class App extends React.Component {
  state = {
    claimUrl: null,
    error: null,
    success: null,
    uploading: false,
  };

  componentWillMount() {
    const me = this;

    const {
      intentType = null,
      intentText = null,
      intentUri = null,
    } = me.props;

    console.log('componentWillMount');

    if(intentType && intentUri) {
      console.log({
        intentType,
        intentUri,
      });

      let data = new FormData();

      let randomName = 'share-'+ Math.random().toString(36).substring(2);

      data.append('file', { uri: intentUri, type: intentType, name: randomName + intentType.replace('/', '.') });
      data.append('name', randomName);
      data.append('title', '');
      data.append('description', '');
      data.append('license', '');
      data.append('nsfw', false);
      data.append('type', intentType);

      me.state.uploading = true;

      const response = fetch('https://spee.ch/api/claim/publish', {
        method: 'POST',
        body: data,
      })
      .then(response => response.json())
      .then((response) => {
        console.log({
          response
        });
        if(response.success === true) {
          me.setState({
            success: true,
            claimUrl: response.data ? response.data.url : '',
          });
        }
      })
      .catch((error) => me.setState({ error }) );
    }
  }

  render() {
    const {
      intentType = null,
      intentText = null,
      intentUri = null,
    } = this.props;

    const {
      claimUrl,
      error,
      success,
      uploading,
    } = this.state;

    let content = null;

    if (success) {
      content = (
        <TouchableWithoutFeedback key="successInfo" onPress={() => Linking.openURL(claimUrl)}>
          <View style={styles.centeredContent}>
            <Text style={styles.genericStatusText}>Shared on Spee.ch!</Text>
            <Text style={styles.linkText}>{claimUrl}</Text>
          </View>
        </TouchableWithoutFeedback>
      );
    } else if (error) {
      content = (
        <View style={styles.centeredContent}>
          <Text style={[styles.genericStatusText, { color: '#680000' }]}>Error Sharing</Text>
          <Text style={[styles.genericStatusText, { fontSize: 14 }]}>{JSON.stringify(error)}</Text>
        </View>
      );
    } else if (uploading) {
      content = (
        <View key="uploadingIndicator" style={styles.centeredContent}>
          <ActivityIndicator size={80} color="#0000ff" />
          <Text style={styles.genericStatusText}>Uploading...</Text>
        </View>
      );
    } else {
      content = (
        <View style={styles.centeredContent}>
          <Text style={[styles.genericStatusText, { color: '#680000' }]}>Error</Text>
          <Text style={[styles.genericStatusText, { fontSize: 14 }]}>Unexpected error, no content to proceed with.</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {content}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  centeredContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  genericStatusText: {
    color: '#777',
    fontSize: 18,
  },
  linkText: {
    color: '#005068',
    fontSize: 16,
  }
});
