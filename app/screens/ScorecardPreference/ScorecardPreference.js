import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Button, Subheading} from 'react-native-paper';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import DatePicker from 'react-native-datepicker';
import Moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import Loading from 'react-native-whc-loading';

import {LocalizationContext} from '../../components/Translations';
import SelectPicker from '../../components/SelectPicker';
import MessageLabel from '../../components/MessageLabel';
import Color from '../../themes/color';
import {getPickerFormatFromObject, getPickerDefaultValue} from '../../services/dropdown_picker_service';
import {checkConnection} from '../../services/api_connectivity_service';

import {connect} from 'react-redux';
import {loadProgramLanguageAction} from '../../actions/programLanguageAction';

class ScorecardPreference extends Component {
  static contextType = LocalizationContext;
  constructor(props) {
    super(props);
    this.state = {
      detail: '',
      languages: [],
      textLanguage: '',
      audioLanguage: '',
      date: Moment().format('DD/MM/YYYY'),
      message: '',
      messageType: '',
    };
  }

  async componentDidMount() {
    const scorecard = await AsyncStorage.getItem('SCORECARD_DETAIL');
    this.setState({detail: JSON.parse(scorecard)});
    this.loadProgramLanguage();
  }

  loadProgramLanguage = () => {
    this.refs.loading.show();
    AsyncStorage.setItem('IS_CONNECTED', 'false');
    const programId = this.state.detail['program_id'];
    this.props.loadProgramLanguageAction(programId, async (isSuccess, response) => {
      AsyncStorage.setItem('IS_CONNECTED', 'true');
      if (isSuccess) {
        const result = await response;
        const newFormatLanguages = getPickerFormatFromObject(result);
        const defaultLanguage = this.getDefaultValue(newFormatLanguages, '');
        this.setState({
          languages: newFormatLanguages,
          textLanguage: defaultLanguage,
          audioLanguage: defaultLanguage,
        });
        this.refs.loading.show(false);
      }
      else {
        this.setState({
          messageType: 'error',
          message: 'failedToGetLanguage',
        });
        this.refs.loading.show(false);
      }
    });

    checkConnection((type, message) => {
      this.setState({
        messageType: type,
        message: message,
      });
      this.refs.loading.show(false);
    });
  }

  getDefaultValue = (items, value) => {
    const defaultValue = getPickerDefaultValue(value);
    if (defaultValue != null)
      return defaultValue;

    return items[0].value;
  }

  changeTextLanguage = (item) => {
    this.setState({textLanguage: item.value})
  }

  changeAudioLanguage = (item) => {
    this.setState({audioLanguage: item.value});
  }

  saveSelectedData = () => {
    const {date, textLanguage, audioLanguage} = this.state;
    AsyncStorage.setItem('SELECTED_DATE', date);
    AsyncStorage.setItem('SELECTED_TEXT_LANGUAGE', textLanguage);
    AsyncStorage.setItem('SELECTED_AUDIO_LANGUAGE', audioLanguage);
  }

  renderForm = () => {
    const {translations} = this.context;
    const {languages, textLanguage, audioLanguage, messageType, message} = this.state;
    return (
      <View style={{marginTop: 10}}>
        <View style={styles.dropDownContainer}>
          <Text style={[styles.inputLabel, {top: -15, zIndex: 10}]}>
            {translations['date']}
          </Text>
          <DatePicker
            style={{width: 200}}
            date={this.state.date}
            mode="date"
            placeholder="select date"
            format="DD/MM/YYYY"
            minDate={Moment().format('DD/MM/YYYY')}
            style={{width: '100%'}}
            customStyles={{
              dateInput: {
                height: 50,
                paddingLeft: 60,
                borderColor: Color.inputBorderLineColor,
                borderWidth: 2,
                borderRadius: 4,
                alignItems: 'flex-start',
              },
            }}
            iconComponent={
              <MaterialIcon
                size={25}
                color={Color.inputBorderLineColor}
                name="calendar-today"
                style={{position: 'absolute', left: 16}}
              />
            }
            onDateChange={(date) => {
              this.setState({date: date});
            }}
          />
        </View>

        <SelectPicker
          items={languages}
          selectedItem={textLanguage}
          label="textDisplayIn"
          placeholder="selectLanguage"
          searchablePlaceholder="searchForLanguage"
          zIndex={6000}
          customLabelStyle={{zIndex: 6001}}
          showCustomArrow={true}
          onChangeItem={this.changeTextLanguage}
        />

        <SelectPicker
          items={languages}
          selectedItem={audioLanguage}
          label="audioPlayIn"
          placeholder="selectLanguage"
          searchablePlaceholder="searchForLanguage"
          zIndex={5000}
          customLabelStyle={{zIndex: 5001}}
          showCustomArrow={true}
          onChangeItem={this.changeAudioLanguage}
        />

        <MessageLabel
          message={message}
          type={messageType}
          customStyle={{marginTop: 120}}
        />

        <Button
          onPress={() => this.saveSelectedData()}
          mode="contained"
          uppercase={true}
          contentStyle={{height: 50}}
          color={Color.primaryColor}
          labelStyle={{fontSize: 18}}
          style={{marginTop: 20}}
        >
          {translations['next']}
        </Button>
      </View>
    );
  };

  render() {
    const {translations} = this.context;

    return (
      <View style={styles.container}>
        <Loading
          ref="loading"
          backgroundColor="#ffffffF2"
          borderRadius={5}
          size={70}
          imageSize={40}
          indicatorColor={Color.primaryColor}
        />
        <Text style={styles.headline}>
          {translations['scorecardPreference']}
        </Text>
        <Subheading style={{color: 'gray'}}>
          {translations['pleaseFillInformationBelow']}
        </Subheading>
        {this.renderForm()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  headline: {
    color: Color.primaryColor,
    fontSize: 25,
    fontWeight: '700',
  },
  inputLabel: {
    backgroundColor: 'white',
    color: Color.inputBorderLineColor,
    fontWeight: '700',
    marginLeft: 12,
    paddingHorizontal: 6,
    position: 'absolute',
  },
  dropDownContainer: {
    marginTop: 20,
    position: 'relative',
  },
  dropDownContainerStyle: {
    height: 50,
    marginTop: 10,
  },
  dropDownPickerStyle: {
    backgroundColor: 'white',
    zIndex: 5000,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderWidth: 2,
    borderColor: Color.inputBorderLineColor,
  },
});

function mapStateToProps(state) {
  return {
    isLoading: state.loadProgramLanguageReducer.isLoading,
    languages: state.loadProgramLanguageReducer.languages,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadProgramLanguageAction: (programId, callback) =>
      dispatch(loadProgramLanguageAction(programId, callback)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ScorecardPreference);