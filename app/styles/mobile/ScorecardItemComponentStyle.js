import { StyleSheet } from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { FontFamily } from '../../assets/stylesheets/theme/font';
import { mdLabelSize, smLabelSize, xlIconSize } from '../../constants/mobile_font_size_constant';
import Color from '../../themes/color';

const ScorecardItemComponentStyles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 20,
    marginTop: -5,
    marginBottom: -6
  },
  subTitle: {
    fontFamily: FontFamily.title,
    marginBottom: 8,
    flex: 1,
    fontSize: wp(smLabelSize),
    marginTop: 3,
  },
  viewDetailContainer: {
    height: 32
  },
  viewDetailLabel: {
    fontSize: wp(smLabelSize),
  },
  viewDetailIcon: {
    fontSize: wp('4%'),
    marginRight: 6,
  },
  statusIcon: {
    fontSize: wp(xlIconSize),
    color: Color.whiteColor
  },
  lockIcon: {
    fontSize: wp('5%'),
  },
  deleteContainer: {
    backgroundColor: Color.redColor,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  deleteLabel: {
    fontSize: wp(mdLabelSize)
  }
});

export default ScorecardItemComponentStyles;