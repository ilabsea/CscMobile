import React, { Component } from 'react';
import { StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';

import ErrorRequestToServerContent  from './ErrorRequestToServerContent';
import ErrorAuthenticationContent from './ErrorAuthenticationContent';
import ErrorMessageContent from './ErrorMessageContent';
import {
  ERROR_AUTHENTICATION,
  ERROR_ENDPOINT,
  ERROR_NOT_FOUND,
} from '../../constants/error_constant';

class ErrorMessageModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backendUrl: '',
    };
  }

  async componentDidMount() {
    const setting = await AsyncStorage.getItem('SETTING');
    this.setState({
      backendUrl: setting != null ? JSON.parse(setting).backendUrl : 'https://isaf-stg.ilabsea.org',
    }, () => {
      AsyncStorage.setItem('ENDPOINT_URL', this.state.backendUrl);
    });
  }

  _renderContent = () => {
    if (this.props.errorType === ERROR_AUTHENTICATION)
      return <ErrorAuthenticationContent backendUrl={this.state.backendUrl} onDismiss={this.props.onDismiss} />
    else if (this.props.errorType === ERROR_ENDPOINT || this.props.errorType == ERROR_NOT_FOUND)
      return <ErrorRequestToServerContent
                backendUrl={this.state.backendUrl}
                onDismiss={this.props.onDismiss}
                isSubmit={this.props.isSubmit}
                errorType={this.props.errorType}
              />;

    return <ErrorMessageContent onDismiss={this.props.onDismiss} />
  }

  render() {
    return (
      <Portal>
        <Modal visible={this.props.visible} onDismiss={this.props.onDismiss} contentContainerStyle={styles.container}>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            {this._renderContent()}
          </TouchableWithoutFeedback>
        </Modal>
      </Portal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 30,
    width: '60%',
    justifyContent: 'flex-start',
    alignSelf: 'center',
  },
});

export default ErrorMessageModal;