import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-community/async-storage';

import {LocalizationContext} from '../../components/Translations';
import MessageLabel from '../../components/MessageLabel';
import ErrorMessageModal from '../../components/ErrorMessageModal/ErrorMessageModal';
import ScorecardInfoModal from '../../components/NewScorecard/ScorecardInfoModal';
import ButtonForgetCode from '../../components/NewScorecard/ButtonForgetCode';
import ScorecardCodeInput from '../../components/NewScorecard/ScorecardCodeInput';

import Color from '../../themes/color';
import validationService from '../../services/validation_service';
import {checkConnection, getErrorType} from '../../services/api_service';
import Scorecard from '../../models/Scorecard';

import { isDownloaded } from '../../services/scorecard_download_service';
import authenticationFormService from '../../services/authentication_form_service';
import internetConnectionService from '../../services/internet_connection_service';
import ScorecardService from '../../services/scorecardService';
import { load as loadProgramLanguage } from '../../services/program_language_service';
import scorecardHelper from '../../helpers/scorecard_helper';

import Brand from '../../components/Home/Brand';
import Logos from '../../components/Home/Logos';

import { ERROR_SCORECARD } from '../../constants/error_constant';

import { connect } from 'react-redux';
import { set } from '../../actions/currentScorecardAction';

import { getDeviceStyle } from '../../utils/responsive_util';
import NewScorecardTabletStyles from '../../styles/tablet/NewScorecardScreenStyle';
import NewScorecardMobileStyles from '../../styles/mobile/NewScorecardScreenStyle';

const responsiveStyles = getDeviceStyle(NewScorecardTabletStyles, NewScorecardMobileStyles);

class NewScorecard extends Component {
  static contextType = LocalizationContext;
  constructor(props) {
    super(props);
    this.uuid = '';
    this.state = {
      code: '',
      errorMsg: '',
      messageType: '',
      isLoading: false,
      visibleModal: false,
      errorType: null,
      visibleInfoModal: false,
      isSubmitted: false,
      hasInternetConnection: false,
    };

    this.unsubscribeNetInfo;
    this.scorecardRef = React.createRef();
  }

  componentDidMount() {
    this.unsubscribeNetInfo = internetConnectionService.watchConnection((hasConnection) => {
      this.setState({ hasInternetConnection: hasConnection });
    });
  }

  componentWillUnmount() {
    this.unsubscribeNetInfo && this.unsubscribeNetInfo();
  }

  isValid = () => {
    this.setState({ errorMsg: '', });
    const {code} = this.state;
    const codeValidationMsg = validationService('scorecardCode', code);

    if (codeValidationMsg != null)
      return false;

    return true;
  };

  joinScorecard = async (code) => {
    this.setState({ code });
    const isAuthenticated = await authenticationFormService.isAuthenticated();

    if (!isAuthenticated) {
      this.setErrorState('422');
      return;
    }

    const isSubmitted = Scorecard.isSubmitted(code);
    if (!this.isValid() || isSubmitted) {
      this.setState({
        visibleInfoModal: isSubmitted,
        isSubmitted: isSubmitted,
      });

      return;
    }

    if (Scorecard.isExists(code)) {
      AsyncStorage.setItem('SELECTED_SCORECARD_UUID', code);

      if (!isDownloaded(code)) {
        this.props.navigation.navigate('ScorecardDetail', {scorecard_uuid: code});
        return;
      }

      this.setState({
        visibleInfoModal: true,
        isSubmitted: false,
      });

      return;
    }

    if (!this.state.hasInternetConnection) {
      const { translations } = this.context;
      internetConnectionService.showAlertMessage(translations.noInternetConnection);
      return;
    }

    this.setState({isLoading: true});
    AsyncStorage.setItem('IS_CONNECTED', 'false');

    const scorecardService = new ScorecardService();
    scorecardService.find(code, (responseData) => {
      AsyncStorage.setItem('IS_CONNECTED', 'true');
      if (responseData === null) {
        this.setState({isLoading: false});
        this.setState({
          visibleModal: true,
          errorType: ERROR_SCORECARD,
        });
      }
      // else if (!scorecardHelper.isScorecardAvailable(responseData)) {
      //   this.setState({isLoading: false});
      //   this.setState({
      //     visibleModal: true,
      //     errorType: scorecardHelper.getScorecardErrorType(responseData),
      //   });
      // }
      else {
        this.uuid = responseData.uuid;
        Scorecard.upsert(responseData);

        loadProgramLanguage(responseData.program_id, (response) => {
          this.setState({isLoading: false});
          this.props.navigation.navigate('ScorecardDetail', {scorecard_uuid: this.uuid});
        });
      }
    }, (error) => {
      AsyncStorage.setItem('IS_CONNECTED', 'true');
      this.setState({isLoading: false});
      this.setErrorState(error.status);
    });

    checkConnection((type, message) => {
      this.setState({
        messageType: type,
        errorMsg: message,
        isLoading: false,
      });
    });
  };

  setErrorState = (error) => {
    this.setState({
      visibleModal: true,
      errorType: getErrorType(error),
    });
  }

  renderErrorMsg = () => {
    const {errorMsg, messageType} = this.state;
    const { translations } = this.context;

    if (errorMsg != '') {
      return (
        <MessageLabel
          message={translations[errorMsg]}
          type={messageType}
          customStyle={{marginTop: 10}}
        />
      );
    }
  };


  closeModal = (type, hasAutoFocus) => {
    if (type == 'error-modal')
      this.setState({ visibleModal: false });
    else
      this.setState({ visibleInfoModal: false });

    if (hasAutoFocus)
      this.scorecardRef.current.inputRef.focusField(5);
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ImageBackground source={require('../../assets/images/home/bg.jpg')} style={styles.imageBg}>
          <View style={{alignItems: 'center', flex: 1}}>
            <Spinner
              visible={this.state.isLoading}
              color={Color.primaryColor}
              overlayColor={Color.loadingBackgroundColor}
            />

            <View style={{flex: 3}}></View>

            <Brand/>

            <View style={responsiveStyles.formContainer}>
              <ScorecardCodeInput
                ref={this.scorecardRef}
                joinScorecard={this.joinScorecard}
              />

              {this.renderErrorMsg()}
              <ButtonForgetCode navigation={this.props.navigation} />
            </View>

            <Logos />

            <ErrorMessageModal
              visible={this.state.visibleModal}
              onDismiss={() => this.closeModal('error-modal', true)}
              errorType={this.state.errorType}
              isNewScorecard={true}
              scorecardUuid={this.state.code}
            />

            <ScorecardInfoModal
              visible={this.state.visibleInfoModal}
              navigation={this.props.navigation}
              onDismiss={(hasAutoFocus) => this.closeModal('info-modal', hasAutoFocus)}
              isSubmitted={this.state.isSubmitted}
              scorecardUuid={this.state.code}
              setCurrentScorecard={(scorecard) => this.props.setCurrentScorecard(scorecard)}
            />
          </View>
        </ImageBackground>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  errorLabel: {
    color: Color.errorColor,
  },
  imageBg: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
});

function mapDispatchToProps(dispatch) {
  return {
    setCurrentScorecard: (scorecard) => dispatch(set(scorecard)),
  };
}

export default connect(
  null,
  mapDispatchToProps,
)(NewScorecard);
