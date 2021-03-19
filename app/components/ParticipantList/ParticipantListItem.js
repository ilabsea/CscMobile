import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {LocalizationContext} from '../Translations';
import participantHelper from '../../helpers/participant_helper';

import { getDeviceStyle } from '../../utils/responsive_util';

import ParticipantListItemTabletStyles from '../../assets/stylesheets/components/tablet/ParticipantListItemStyle';
import ParticipantListItemMobileStyles from '../../assets/stylesheets/components/mobile/ParticipantListItemStyle';

const styles = getDeviceStyle(ParticipantListItemTabletStyles, ParticipantListItemMobileStyles);

class ParticipantListItem extends Component {
  static contextType = LocalizationContext;
  renderParticipantNumber = (participant, index) => {
    if (participant != undefined)
      return (
        <View style={styles.numberContainer}>
          <Text style={styles.numberLabel}>{index + 1}</Text>
        </View>
      );

    return <MaterialIcon name="help" size={45} color="gray" style={{marginTop: -4, marginLeft: -4}} />;
  };

  renderGender = (participant) => {
    if (participant === undefined) return <Text style={styles.emptyLabel}>---</Text>;
    if (participant.gender === '')
      return <MaterialIcon name="person" size={25} color="#b9b9b9" style={{paddingHorizontal: 10}} />;

    const gender = participantHelper.getGenderIconLabel(participant.gender);
    return <FontAwesomeIcon name={gender} color="black" style={styles.iconStyle} />;
  };

  getAge = (participant) => {
    if (participant === undefined || participant.age === '')
      return '---';

    return participant.age;
  }

  renderStatusIcon = (participant, fieldName) => {
    if (participant === undefined) return <Text style={styles.emptyLabel}>---</Text>;

    if (!participant[fieldName])
      return <MaterialIcon name="cancel" color="#a52b2b" style={styles.iconStyle} />;

    return <MaterialIcon name="check-circle" color="#4a76f3" style={styles.iconStyle} />;
  }

  editParticipant = (index) => {
    const participantUUID = this.props.participant != undefined ? this.props.participant.uuid : null;
    this.props.navigation.navigate('AddNewParticipant', {scorecard_uuid: this.props.scorecardUUID, index: index, participant_uuid: participantUUID});
  }

  render() {
    const {translations} = this.context;
    const {index, participant} = this.props;
    return (
      <TouchableOpacity>
        <View style={styles.itemContainer}>
          <View style={styles.orderNumberColumn}>
            {this.renderParticipantNumber(participant, index)}
          </View>
          <View style={styles.itemColumn}>
            <View style={styles.itemValueContainer}>{this.renderGender(participant)}</View>
          </View>
          <View style={styles.itemColumn}>
            <View style={styles.itemValueContainer}>
              <Text style={styles.ageItem}>{this.getAge(participant)}</Text>
            </View>
          </View>
          <View style={styles.itemColumn}>
            <View style={styles.itemValueContainer}>
              {this.renderStatusIcon(participant, 'disability')}
            </View>
          </View>
          <View style={styles.itemColumn}>
            <View style={styles.itemValueContainer}>
              {this.renderStatusIcon(participant, 'minority')}
            </View>
          </View>
          <View style={styles.itemColumn}>
            <View style={styles.itemValueContainer}>
              {this.renderStatusIcon(participant, 'poor')}
            </View>
          </View>
          <View style={styles.itemColumn}>
            <View style={styles.itemValueContainer}>
              {this.renderStatusIcon(participant, 'youth')}
            </View>
          </View>
          <TouchableOpacity style={{width: 60, alignItems: 'center', paddingTop: 0}}
            onPress={() => this.editParticipant(index)}>
            <MaterialIcon name="edit" color="#e4761e" style={styles.iconStyle} />
            <Text style={styles.editLabel}>{translations.edit}</Text>
          </TouchableOpacity>
        </View>
        <View style={{borderBottomWidth: 1, borderBottomColor: '#b9b9b9', flex: 1}} />
      </TouchableOpacity>
    );
  }
}

export default ParticipantListItem;
