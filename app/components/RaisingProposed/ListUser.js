import React, {Component} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from 'native-base';
import {LocalizationContext} from '../Translations';
import UserTable from './UserTable';
import ParticipantAccordion from '../ParticipantAccordion/ParticipantAccordion';
import CriteriaAccordion from '../CriteriaAccordion/CriteriaAccordion';

import { connect } from 'react-redux';
import { getRaisedParticipants } from '../../services/participant_service';
import { FontFamily } from '../../assets/stylesheets/theme/font';

import ParticipantInfo from '../CreateNewIndicator/ParticipantInfo';
import ProposedCriteria from '../../models/ProposedCriteria';
import Participant from '../../models/Participant';

import { getDeviceStyle } from '../../utils/responsive_util';
import RaisingProposedTabletStyles from '../../styles/tablet/RaisingProposedComponentStyle';
import RaisingProposedMobileStyles from '../../styles/mobile/RaisingProposedComponentStyle';

const responsiveStyles = getDeviceStyle(RaisingProposedTabletStyles, RaisingProposedMobileStyles);

class ListUser extends Component {
  static contextType = LocalizationContext;
  constructor(props) {
    super(props);

    this.state = {
      accordionType: 'participant'
    }
  }

  getParticipant = () => {
    const raisedParticipants = getRaisedParticipants(this.props.scorecardUUID);
    let participants = [];

    for (let i=0; i<raisedParticipants.length; i++) {
      const gender = raisedParticipants[i].gender === 'female' ? 'F' : raisedParticipants[i].gender === 'male' ? 'M' : 'other';
      const proposedCriterias = raisedParticipants[i].proposed_criterias != undefined ? raisedParticipants[i].proposed_criterias : ProposedCriteria.find(this.props.scorecardUUID, raisedParticipants[i].uuid);

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

  renderUserTable = () => {
    const tableData = this.getParticipant();

    return (
      <UserTable tableData={tableData} scorecardUUID={this.props.scorecardUUID} navigation={this.props.navigation} />
    );
  };

  _goToCreateNewIndicator(participant_uuid) {
    this.props.navigation.navigate('CreateNewIndicator', {scorecard_uuid: this.props.scorecardUUID, participant_uuid: participant_uuid});
  }

  renderAccordionOptions() {
    const isCriteriaActive = this.state.accordionType == 'criteria';
    const isParticipantActive = this.state.accordionType == 'participant';

    return (
      <View style={{flexDirection: 'row', marginTop: 20}}>
        <TouchableOpacity onPress={() => this.setState({ accordionType: 'participant' })}
          style={[responsiveStyles.filterBtn, { marginRight: 10 }, isParticipantActive ? responsiveStyles.activeBtn : {}]}
        >
          <Text style={[responsiveStyles.btnText, isParticipantActive ? responsiveStyles.activeText : {}]}>អ្នកស្នើ</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.setState({ accordionType: 'criteria' })}
          style={[responsiveStyles.filterBtn, isCriteriaActive ? responsiveStyles.activeBtn : {}]}
        >
          <Text style={[responsiveStyles.btnText, isCriteriaActive ? responsiveStyles.activeText : {}]}>លក្ខណៈវិនិច្ឆ័យ</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const {translations} = this.context;

    return (
      <View>
        <View style={styles.headingContainer}>
          <Text style={[styles.headingTitle, responsiveStyles.headingTitle]}>
            { translations.listUser }: { this.props.numberOfProposedParticipant }/{ this.props.numberOfParticipant } {translations.pax}
          </Text>

          <View style={{flexGrow: 1, alignItems: 'flex-end'}}>
            <ParticipantInfo
              participants={Participant.getNotRaised(this.props.scorecardUUID)}
              scorecard_uuid={ this.props.scorecardUUID }
              mode={{type: 'button', label: translations.proposeNewCriteria, iconName: 'plus'}}
              onPressItem={(participant) => this._goToCreateNewIndicator(participant.uuid)}
              onPressCreateParticipant={(participant) => this._goToCreateNewIndicator(participant.uuid)}
              navigation={this.props.navigation}/>
          </View>
        </View>

        {/* { this.renderUserTable() } */}

        { this.renderAccordionOptions() }

        { this.state.accordionType == 'participant' ?
          <ParticipantAccordion
            scorecardUuid={this.props.scorecardUUID}
            participants={this.getParticipant()}
            navigation={this.props.navigation}
          />
          :
          <CriteriaAccordion scorecardUuid={this.props.scorecardUUID} />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  headingTitle: {
    fontSize: 20,
    fontFamily: FontFamily.title,
    color: '#22354c',
  }
});

function mapStateToProps(state) {
  return {participants: state.participantReducer.participants};
}

export default connect(mapStateToProps, null)(ListUser);
