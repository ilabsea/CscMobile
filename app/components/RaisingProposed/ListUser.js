import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Icon, Text} from 'native-base';
import {LocalizationContext} from '../Translations';
import UserTable from './UserTable';
import realm from '../../db/schema';
import { connect } from 'react-redux';
import { getRaisedParticipants } from '../../services/participant_service';
import { FontFamily } from '../../assets/stylesheets/theme/font';

import ParticipantInfo from '../CreateNewIndicator/ParticipantInfo';

import { getDeviceStyle } from '../../utils/responsive_util';
import ListUserTabletStyles from '../../assets/stylesheets/components/tablet/ListUserStyle';
import ListUserMobileStyles from '../../assets/stylesheets/components/mobile/ListUserStyle';

const styles = getDeviceStyle(ListUserTabletStyles, ListUserMobileStyles);

class ListUser extends Component {
  static contextType = LocalizationContext;

  getParticipant = () => {
    const raisedParticipants = getRaisedParticipants(this.props.scorecardUUID);
    let participants = [];

    for (let i=0; i<raisedParticipants.length; i++) {
      const gender = raisedParticipants[i].gender === 'female' ? 'F' : raisedParticipants[i].gender === 'male' ? 'M' : 'other';
      const proposedCriterias = raisedParticipants[i].proposed_criterias != undefined ? raisedParticipants[i].proposed_criterias : this.getProposedCriteria(raisedParticipants[i].uuid);

      if (proposedCriterias.length === 0)
        continue;

      const attrs = [
        i + 1,
        raisedParticipants[i].age,
        gender,
        raisedParticipants[i].disability,
        proposedCriterias,
        raisedParticipants[i].uuid,
      ];
      participants.push(attrs);
    }
    return participants;
  };

  getProposedCriteria = (participantUuid) => {
    return realm.objects('ProposedCriteria').filtered('scorecard_uuid = "'+ this.props.scorecardUUID +'" AND participant_uuid = "'+ participantUuid +'"');
  }

  renderUserTable = () => {
    const tableData = this.getParticipant();

    return (
      <UserTable tableData={tableData} scorecardUUID={this.props.scorecardUUID} navigation={this.props.navigation} />
    );
  };

  _goToCreateNewIndicator(participant_uuid) {
    this.props.navigation.navigate('CreateNewIndicator', {scorecard_uuid: this.props.scorecardUUID, participant_uuid: participant_uuid});
  }

  render() {
    const {translations} = this.context;

    return (
      <View style={{marginTop: 40}}>
        <View style={styles.headingContainer}>
          <Text style={styles.headingTitle}>{translations['listUser']}</Text>

          <View style={{flexGrow: 1, alignItems: 'flex-end'}}>
            <ParticipantInfo
              participants={realm.objects('Participant').filtered(`scorecard_uuid='${this.props.scorecardUUID}' AND raised=false SORT(order ASC)`)}
              scorecard_uuid={ this.props.scorecardUUID }
              mode={{type: 'button', label: translations.proposeNewCriteria, iconName: 'plus'}}
              onPressItem={(participant) => this._goToCreateNewIndicator(participant.uuid)}
              onPressCreateParticipant={(participant) => this._goToCreateNewIndicator(participant.uuid)}
              navigation={this.props.navigation}/>
          </View>
        </View>

        { this.renderUserTable() }
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {participants: state.participantReducer.participants};
}

export default connect(mapStateToProps, null)(ListUser);
