import React, {Component} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';

import Color from '../../themes/color';

import Tip from '../Tip';
import CriteriaList from './CriteriaList';
import ListUser from './ListUser';
import BottomButton from '../BottomButton';
import {LocalizationContext} from '../../components/Translations';
import {Criteria} from '../../services/criteria_service';
import {getRaisedParticipants} from '../../services/participant_service';
import Participant from '../../models/Participant';
import {connect} from 'react-redux';
import { removeFromSelected } from '../../actions/selectedCriteriaAction';
import { containerPadding } from '../../utils/responsive_util';

class UserListing extends Component {
  static contextType = LocalizationContext;

  onPress = () => {
    this.clearSelectedCriterias();

    this.props.navigation.navigate('OfflineIndicatorDevelopment', {scorecard_uuid: this.props.scorecardUUID});
  }

  clearSelectedCriterias = () => {
    this.props.selectedCriterias.map(criteria => {
      this.props.removeFromSelected(criteria);
    });
  }

  hasRaisedCriteria = () => {
    const raisedParticipants = getRaisedParticipants(this.props.scorecardUUID);
    const criteria = new Criteria(this.props.scorecardUUID);
    return criteria.hasRaisedCritria(raisedParticipants)
  }

  renderFinishButton = () => {
    const {translations} = this.context;

    return (
      <View style={styles.buttonContainer}>
        <BottomButton
          disabled={!this.hasRaisedCriteria()}
          label={translations['finishAndNext']}
          onPress={() => this.onPress()}
        />
      </View>
    );
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#eee'}}>
        <ScrollView contentContainerStyle={{padding: containerPadding, paddingBottom: 28}}>
          <Tip screenName={'RaisingProposed'}/>

          {/* <CriteriaList scorecardUUID={this.props.scorecardUUID}
            participants={Participant.getAll(this.props.scorecardUUID)}
            numberOfProposedParticipant={Participant.getNumberOfProposedParticipant(this.props.scorecardUUID)}
          /> */}
          <ListUser
            scorecardUUID={this.props.scorecardUUID}
            navigation={this.props.navigation}
            numberOfParticipant={Participant.getAll(this.props.scorecardUUID).length}
            numberOfProposedParticipant={Participant.getNumberOfProposedParticipant(this.props.scorecardUUID)}
          />
        </ScrollView>

        { this.renderFinishButton() }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonContainer: {
    padding: containerPadding
  },
  buttonLabelStyle: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: Color.whiteColor,
  },
});

function mapStateToProps(state) {
  return {
    participants: state.participantReducer.participants,
    selectedCriterias: state.selectedCriterias,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    removeFromSelected: (criteria) => dispatch(removeFromSelected(criteria)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserListing);
