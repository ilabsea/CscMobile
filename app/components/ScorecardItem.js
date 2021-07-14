import React, {Component} from 'react';

import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';
import { Divider } from 'react-native-paper';
import AppIcon from 'react-native-vector-icons/FontAwesome';

import { LocalizationContext } from '../components/Translations';
import Color from '../themes/color';
import uuidV4 from '../utils/uuidv4';
import styles from '../themes/scorecardListItemStyle';
import votingCriteriaService from '../services/votingCriteriaService';
import scorecardHelper from '../helpers/scorecard_helper';

import { getDeviceStyle } from '../utils/responsive_util';
import ScorecardItemTabletStyles from '../styles/tablet/ScorecardItemComponentStyle';
import ScorecardItemMobileStyles from '../styles/mobile/ScorecardItemComponentStyle';
import { FontFamily } from '../assets/stylesheets/theme/font';

const responsiveStyles = getDeviceStyle(ScorecardItemTabletStyles, ScorecardItemMobileStyles);

export default class ScorecardItem extends Component {
  static contextType = LocalizationContext;

  constructor(props) {
    super(props);

    this.itemRef = null;
  }

  renderStatusIcon(scorecard) {
    const icon = scorecardHelper.getStatusIcon(scorecard);

    return (
      <View style={{borderWidth: 1.2, width: 35, height: 35, justifyContent: 'center', alignItems: 'center', borderRadius: 30, borderColor: scorecardHelper.iconBorderColor(scorecard)}}>
        <AppIcon name={icon} size={20} color={scorecardHelper.iconColor(scorecard)} />
      </View>
    )
  }

  deleteScorecard = () => {
    this.props.showDeleteModal();
    this.itemRef.close();
  }

  renderDeleteAction = () => {
    const { translations } = this.context;

    return (
      <RectButton
        onPress={() => this.deleteScorecard()}
        style={responsiveStyles.deleteContainer}
      >
        <Text style={[{color: Color.whiteColor}, responsiveStyles.deleteLabel]}>{ translations.delete }</Text>
      </RectButton>
    )
  }

  render() {
    const { translations, appLanguage } = this.context;
    let scorecard = this.props.scorecard || {};
    let criteriasSize = votingCriteriaService.getAll(scorecard.uuid).length;
    const subTextStyles = { paddingTop: getDeviceStyle(2, 1), height: getDeviceStyle(27, 23) };

    return (

      <Swipeable
        ref={ref => { this.itemRef = ref }}
        key={uuidV4()}
        enabled={!scorecard.isUploaded}
        renderRightActions={this.renderDeleteAction}
      >
        <TouchableOpacity
          style={{height: 70, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, backgroundColor: Color.whiteColor}}
        >
          {this.renderStatusIcon(scorecard)}

          <View style={{flex: 1, marginLeft: 15}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={[{fontSize: 14, flex: 1}]}>{ scorecard.uuid }</Text>
              <Text style={[styles.subText, subTextStyles, {marginTop: 2}]}>{translations.numberOfCriteria}: {criteriasSize}</Text>
            </View>

            <View style={{flexDirection: 'row', paddingRight: 10, alignItems: 'center'}}>
              <AppIcon name='map-marker' size={14} color={Color.grayColor} style={{marginRight: 5, marginTop: -4}} />
              <Text numberOfLines={1} style={[styles.subText, { marginLeft: 0, color: Color.grayColor}]}>{scorecard.province} {scorecard.district} {scorecard.commune}</Text>
            </View>

            { scorecard.isUploaded &&
              <Text style={{ fontSize: getDeviceStyle(12, 10), color: Color.redColor, fontFamily: FontFamily.title, paddingTop: getDeviceStyle(4, 0)}}>
                {translations.toBeRemovedOn}: { scorecardHelper.getTranslatedRemoveDate(scorecard.uploaded_date, appLanguage) }
              </Text>
            }
          </View>
        </TouchableOpacity>
        <Divider style={{backgroundColor: '#b3b3b3'}} />
      </Swipeable>
    )
  }
}