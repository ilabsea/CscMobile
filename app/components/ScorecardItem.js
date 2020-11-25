import React, {Component} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { LocalizationContext } from '../components/Translations';
import { Icon } from 'native-base';
import Color from '../themes/color';
import uuidV4 from '../utils/uuidv4';
import scorecardProgress from '../db/jsons/scorecardProgress';
import realm from '../db/schema';

export default class ScorecardItem extends Component {
  static contextType = LocalizationContext;

  renderStatusIcon(scorecard) {
    let wrapperStyle = scorecard.isCompleted ? {} : { backgroundColor: Color.headerColor };
    let iconName     = scorecard.isCompleted ? 'check' : 'file-alt';

    return (
      <View style={[styles.statusIconWrapper, wrapperStyle]}>
        <Icon name={iconName} type="FontAwesome5" style={{fontSize: 50, color: '#fff'}} />
      </View>
    )
  }

  render() {
    const { translations } = this.context;
    let scorecard = this.props.scorecard || {};
    let status = translations[scorecardProgress.filter(x => x.value == scorecard.status)[0].label];
    let criteriasSize = realm.objects('ProposedCriteria').filtered(`scorecard_uuid='${scorecard.uuid}' DISTINCT(tag)`).length;

    return (
      <TouchableOpacity
        key={uuidV4()}
        onPress={ () => this.props.onPress() }
        style={[styles.listItem, styles.card]}>

        { this.renderStatusIcon(scorecard) }

        <View style={styles.contentWrapper}>
          <Text style={styles.title}>ID: {scorecard.name}</Text>

          <View style={styles.subTextWrapper}>
            <Icon name='people' style={styles.subTextIcon} />
            <Text style={styles.subText}>Number of criteria: {criteriasSize}</Text>
          </View>

          <View style={styles.subTextWrapper}>
            <Icon name='document-text' style={styles.subTextIcon} />
            <Text style={styles.subText}>Status: {status}</Text>
          </View>

          <View style={{flex: 1}}></View>

          <View style={styles.viewDetail}>
            <Text style={{color: Color.headerColor}}>{translations['viewDetail']}</Text>
            <Icon name='chevron-forward-outline' style={{fontSize: 24, color: Color.headerColor}} />
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    color: '#3a3a3a',
    marginBottom: 6,
  },
  subTextWrapper: {
    flexDirection: 'row',
    marginTop: 4,
    alignItems: 'center'
  },
  subText: {
    marginLeft: 8,
    fontSize: 14
  },
  subTextIcon: {
    fontSize: 24,
    color: Color.subText
  },
  contentWrapper: {
    paddingLeft: 20,
    paddingTop: 10,
    flex: 1
  },
  statusIconWrapper: {
    width: 160,
    backgroundColor: '#787878',
    alignItems: 'center',
    justifyContent: 'center'
  },
  listItem: {
    height: 160,
    backgroundColor: '#fff',
    marginBottom: 20,
    borderRadius: 4,
    flexDirection: 'row',
  },
  card: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  viewDetail: {
    height: 48,
    borderTopWidth: 1,
    borderTopColor: Color.borderColor,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row'
  }
});
