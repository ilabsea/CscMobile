import React, {Component} from 'react';
import {View, Text, TouchableWithoutFeedback, Keyboard, ScrollView} from 'react-native';
import {Provider, Portal} from 'react-native-paper';

import realm from '../../db/schema';
import {LocalizationContext} from '../../components/Translations';
import ActionButton from '../../components/ActionButton';
import OutlinedActionButton from '../../components/OutlinedActionButton';
import IndicatorCriteriaSelection from '../../components/RaisingProposed/IndicatorCriteriaSelection';
import AddNewIndicatorModal from '../../components/RaisingProposed/AddNewIndicatorModal';
import Color from '../../themes/color';
import {saveParticipant} from '../../actions/participantAction';
import {connect} from 'react-redux';
class CreateNewIndicator extends Component {
  static contextType = LocalizationContext;
  constructor(props) {
    super(props);
    this.indicatorSelectionRef = React.createRef();
    this.state = {
      isModalVisible: false,
      isValid: false,
      selectedIndicators: [],
    };
  }

  componentDidMount() {
    const selectedParticipant = realm.objects('Participant').filtered('uuid = "'+ this.props.route.params.participant_uuid +'"')[0];
    this.setState({isValid: (selectedParticipant != undefined && selectedParticipant.indicator_ids.length > 0) ? true : false});
  }

  selectIndicator = () => {
    this.setState({
      isModalVisible: this.indicatorSelectionRef.current.state.isModalVisible,
      selectedIndicators: this.indicatorSelectionRef.current.state.selectedIndicators,
      isValid: this.indicatorSelectionRef.current.state.selectedIndicators.length > 0 ? true : false,
    });
  };

  closeModal = () => {
    this.setState({isModalVisible: false});
  }

  save = () => {
    let participants = realm.objects('Participant').filtered('scorecard_uuid = "'+ this.props.route.params.uuid +'"').sorted('order', false);
    const attrs = {
      uuid: this.props.route.params.participant_uuid,
      indicator_ids: this.state.selectedIndicators.map(indicator => indicator.id),
      indicator_shortcuts: this.state.selectedIndicators.map(indicator => indicator.shortcut),
    };
    realm.write(() => {realm.create('Participant', attrs, 'modified');});
    this.props.saveParticipant(participants);
    this.props.navigation.goBack();
  }

  renderSaveButton = () => {
    const {translations} = this.context;
    if (this.state.isValid) {
      return (
        <View style={{paddingBottom: 42, justifyContent: 'flex-end'}}>
          <ActionButton
            label={translations['saveAndAddNew']}
            customButtonStyle={{marginBottom: 20}}
            customBackgroundColor={Color.primaryButtonColor}
            isDisabled={false}
          />
          <OutlinedActionButton label={translations['save']} isDisabled={false}
            onPress={() => this.save()}
          />
        </View>
      );
    }
  };

  render() {
    const {translations} = this.context;
    return (
      <Provider>
        <View style={{flex: 1, backgroundColor: '#ffffff'}}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
              <View style={{paddingHorizontal: 20, paddingTop: 21, flex: 1}}>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>Create new indicator</Text>
                <Text style={{fontSize: 18, color: '#2e2e2e', marginTop: 20}}>
                  {translations['chooseIndicatorCategory']}
                </Text>
                <IndicatorCriteriaSelection
                  ref={this.indicatorSelectionRef}
                  selectIndicator={this.selectIndicator}
                  uuid={this.props.route.params.uuid}
                  participantUUID={this.props.route.params.participant_uuid}
                />
                {this.renderSaveButton()}
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
          <Portal>
            <AddNewIndicatorModal
              isVisible={this.state.isModalVisible}
              closeModal={() => this.closeModal()}
            />
          </Portal>
        </View>
      </Provider>
    );
  }
}

function mapStateToProps(state) {
  return {participants: state.participantReducer.participants};
}

function mapDispatchToProps(dispatch) {
  return {saveParticipant: (participants) => dispatch(saveParticipant(participants))};
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateNewIndicator);