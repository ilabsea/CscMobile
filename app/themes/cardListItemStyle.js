import Color from '../themes/color';
import { StyleSheet } from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { FontFamily } from '../assets/stylesheets/theme/font';

import { getDeviceStyle } from '../utils/responsive_util';
import { lgLabelSize } from '../constants/mobile_font_size_constant';

const cardListItemStyle = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  h1: {
    fontSize: 24,
    color: '#3a3a3a',
    marginBottom: 6,
    fontFamily: FontFamily.title
  },
  h2: {
    fontSize: getDeviceStyle(20, wp(lgLabelSize)),
    color: '#3a3a3a',
    marginBottom: 6,
    fontFamily: FontFamily.title
  },
  paragraph: {
    fontSize: 15,
    paddingRight: 10,
    flex: 1
  },
  contentWrapper: {
    paddingLeft: 16,
    paddingTop: 10,
    flex: 1
  },
  statusIconWrapper: {
    width: '22%',
    maxWidth: 160,
    backgroundColor: Color.tipBgColor,
    alignItems: 'center',
    justifyContent: 'center'
  },
  listItem: {
    minHeight: 170,
    marginBottom: 20,
    flexDirection: 'row',
  },
  viewDetail: {
    height: 48,
    borderTopWidth: 1,
    borderTopColor: Color.borderColor,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    paddingRight: 10
  }
});

export default cardListItemStyle;
