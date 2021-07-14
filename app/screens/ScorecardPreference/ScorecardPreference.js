import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableWithoutFeedback} from 'react-native';
import Moment from 'moment';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {LocalizationContext} from '../../components/Translations';
import BottomButton from '../../components/BottomButton';
import DownloadButton from '../../components/ScorecardDetail/DownloadButton';
import ProgressHeader from '../../components/ProgressHeader';
import ErrorMessageModal from '../../components/ErrorMessageModal/ErrorMessageModal';
import MessageModal from '../../components/MessageModal';
import ScorecardPreferenceForm from '../../components/ScorecardPreference/ScorecardPreferenceForm';

import authenticationFormService from '../../services/authentication_form_service';
import { getErrorType } from '../../services/api_service';
import internetConnectionService from '../../services/internet_connection_service';
import scorecardPreferenceService from '../../services/scorecard_preference_service';
import ScorecardService from '../../services/scorecardService';
import Scorecard from '../../models/Scorecard';
import { RUNNING } from '../../constants/milestone_constant';

import { containerPaddingTop, getDeviceStyle, containerPadding } from '../../utils/responsive_util';
import Color from '../../themes/color';
import PopupModalTabletStyles from '../../styles/tablet/PopupModalComponentStyle';
import PopupModalMobileStyles from '../../styles/mobile/PopupModalComponentStyle';

const modalStyles = getDeviceStyle(PopupModalTabletStyles, PopupModalMobileStyles);

import {
  isDownloaded as isScorecardDownloaded,
  download,
  stopDownload,
  getDownloadPercentage,
} from '../../services/scorecard_download_service';

class ScorecardPreference extends Component {
  static contextType = LocalizationContext;
  constructor(props) {
    super(props);
    const scorecard = Scorecard.find(this.props.route.params.scorecard_uuid)

    this.state = {
      scorecard: scorecard,
      languages: [],
      textLocale: scorecard.text_language_code || '',
      audioLocale: scorecard.audio_language_code || '',
      date: scorecard.conducted_date || Moment().format('DD/MM/YYYY'),
      downloadProgress: 0,
      visibleModal: false,
      errorType: null,
      isFinishDownloaded: false,
      isDownloading: false,
      isErrorDownload: false,
      isDownloadAudio: false,
      hasInternetConnection: false,
      visibleConfirmModal: false,
      containerPaddingBottom: 0,
    };

    this.formRef = React.createRef();
    this.unsubscribeNetInfo;
  }

  componentDidMount() {
    const { appLanguage } = this.context;

    this.unsubscribeNetInfo = internetConnectionService.watchConnection((hasConnection) => {
      this.setState({ hasInternetConnection: hasConnection });
    });

    scorecardPreferenceService.loadProgramLanguage(this.state.scorecard, appLanguage,
      (languageSet) => {
        this.setState({
          languages: languageSet.languages,
          textLocale: languageSet.textLocale,
          audioLocale: languageSet.audioLocale,
        });
      },
      (error) => {
        this.setState({languages: []});
      }
    );
  }

  componentWillUnmount() {
    this.unsubscribeNetInfo && this.unsubscribeNetInfo();
  }

  changeValue = (fieldName, value) =>  {
    let newState = {};
    newState[fieldName] = value;
    this.setState(newState);
  }

  saveSelectedData = () => {
    this.formRef.current.closeAllSelectBox()
    const {date, textLocale, audioLocale} = this.state;
    scorecardPreferenceService.updatePreference(this.props.route.params.scorecard_uuid, date, textLocale, audioLocale);

    const scorecardService = new ScorecardService();
    scorecardService.updateMilestone(this.props.route.params.scorecard_uuid, null, RUNNING);

    this.props.navigation.navigate('Facilitator', {scorecard_uuid: this.props.route.params.scorecard_uuid, local_ngo_id: this.props.route.params.local_ngo_id});
  }

  isFullyDownloaded = () => {
    return scorecardPreferenceService.isFullyDownloaded(this.props.route.params.scorecard_uuid, this.state.isFinishDownloaded);
  }

  showConfirmModal = async (hasScorecardDownload) => {
    const { translations } = this.context;
    const isAuthenticated = await authenticationFormService.isAuthenticated();

    if (!this.state.hasInternetConnection) {
      internetConnectionService.showAlertMessage(translations.noInternetConnection);
      return;
    }
    else if (!isAuthenticated) {
      this.errorCallback('422');
      return;
    }

    if (hasScorecardDownload)
      this.downloadScorecard();
    else
      this.setState({ visibleConfirmModal: true });
  }

  downloadScorecard = () => {
    this.setState({ visibleConfirmModal: false });

    if (this.state.errorType || isScorecardDownloaded(this.props.route.params.scorecard_uuid))
      return;

    this.setState({
      errorType: null,
      downloadProgress: 0,
      isDownloading: true,
      isErrorDownload: false,
    });

    const {date, textLocale, audioLocale} = this.state;
    scorecardPreferenceService.updatePreference(this.props.route.params.scorecard_uuid, date, textLocale, audioLocale);

    download(this.state.scorecard, this.state.audioLocale, this.updateDownloadProgress, this.errorCallback);
  };

  updateDownloadProgress = () => {
    let updatedPercentage = this.state.downloadProgress;

    const { scorecard_uuid } = this.props.route.params;
    this.setState({downloadProgress: getDownloadPercentage(scorecard_uuid)}, () => {
      updatedPercentage = isScorecardDownloaded(scorecard_uuid) ? 1 : this.state.downloadProgress;
    });

    if (updatedPercentage >= 1) {
      this.setState({
        isFinishDownloaded: true,
        isDownloading: false,
      });

      Scorecard.update(this.props.route.params.scorecard_uuid, { downloaded: true });
    }
  }

  errorCallback = (error) => {
    this.setState({
      errorType: getErrorType(error),
      isDownloading: false,
      visibleModal: true,
      isErrorDownload: true,
    });
  }

  isDownloadDisabled = () => {
    if (this.state.languages.length == 0)
      return true;

    return this.state.errorType ? false : this.state.isDownloading;
  }

  renderDownloadButton = () => {
    if (this.isFullyDownloaded())
      return;

    const { translations } = this.context;
    const hasScorecardDownload = scorecardPreferenceService.hasScorecardDownload(this.state.scorecard.uuid);
    const label = hasScorecardDownload ? translations.resumeDownload : translations.downloadAndSave;

    return (
      <View>
        { this.state.isErrorDownload &&
          <Text style={{textAlign: 'center', marginBottom: 5, color: Color.redColor}}>{translations.failedToDownloadScorecard}</Text>
        }

        <DownloadButton
          showDownloadProgress={this.state.isDownloading}
          downloadProgress={this.state.downloadProgress}
          disabled={this.isDownloadDisabled()}
          onPress={() => this.showConfirmModal(hasScorecardDownload)}
          label={label}
        />
      </View>
    );
  };

  renderNextButton = () => {
    const {translations} = this.context;
    if (this.isFullyDownloaded()) {
      return (
        <BottomButton label={translations.next} onPress={() => this.saveSelectedData()} />
      );
    }
  };

  onBackPress = () => {
    stopDownload();
    this.props.navigation.goBack();
  }

  onDismissErrorMessageModal = () => {
    this.setState({
      visibleModal: false,
      isErrorDownload: false,
      errorType: null,
    });
  }

  confirmDownloadContent = () => {
    const {translations} = this.context;
    const textLocaleLabel = scorecardPreferenceService.getLocaleLabel(this.state.languages, this.state.textLocale);
    const audioLocaleLabel = scorecardPreferenceService.getLocaleLabel(this.state.languages, this.state.audioLocale);

    return (
      <View style={{marginTop: 15, marginBottom: 10, paddingHorizontal: 15}}>
        <Text style={modalStyles.label}>{translations.downloadScorecardFirstDescription}</Text>
        <Text style={[{ marginTop: 15 }, , modalStyles.label]}>
          {translations.formatString(translations.downloadScorecardSecondDescription, this.props.route.params.scorecard_uuid, textLocaleLabel, audioLocaleLabel)}
        </Text>
      </View>
    )
  }

  updateContainerPadding = (isExpand) => {
    this.setState({ containerPaddingBottom: isExpand ? getDeviceStyle(28, hp('30%')) : 0 });
  }

  render() {
    const {translations} = this.context;

    return (
      <TouchableWithoutFeedback onPress={() => this.formRef.current.closeAllSelectBox()}>
        <View style={{flex: 1, backgroundColor: Color.whiteColor}}>
          <ProgressHeader
            title={translations['getStarted']}
            onBackPress={() => this.onBackPress()}
            onPressHome={() => this.props.navigation.popToTop()}
            progressIndex={0}/>

          <ScrollView contentContainerStyle={[styles.container, { paddingBottom: this.state.containerPaddingBottom }]}>
            <ScorecardPreferenceForm
              ref={this.formRef}
              languages={this.state.languages}
              changeValue={this.changeValue}
              scorecard={this.state.scorecard}
              textLocale={this.state.textLocale}
              audioLocale={this.state.audioLocale}
              updateContainerPadding={this.updateContainerPadding}
            />
          </ScrollView>

          <View style={{padding: containerPadding}}>
            { this.renderDownloadButton() }

            { this.renderNextButton() }
          </View>

          <ErrorMessageModal
            visible={this.state.visibleModal}
            onDismiss={() => this.onDismissErrorMessageModal()}
            errorType={this.state.errorType}
            isNewScorecard={true}
            scorecardUuid={this.props.route.params.scorecard_uuid}
          />

          <MessageModal
            visible={this.state.visibleConfirmModal}
            onDismiss={() => this.setState({visibleConfirmModal: false})}
            title={translations.theScorecardContainsAudios}
            hasConfirmButton={true}
            confirmButtonLabel={translations.ok}
            onPressConfirmButton={() => this.downloadScorecard()}
            child={() => this.confirmDownloadContent()}
            renderInline={false}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Color.whiteColor,
    padding: containerPadding,
    paddingTop: containerPaddingTop,
  },
});

export default ScorecardPreference;
