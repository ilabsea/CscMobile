import { StyleSheet } from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { mdLabelSize, smLabelSize } from '../../constants/mobile_font_size_constant';
import Color from '../../themes/color';
import { FontFamily } from '../../assets/stylesheets/theme/font';

const ParticipantAccordionComponentStyles = StyleSheet.create({
  orderNumberContainer: {
    backgroundColor: Color.lightGrayColor,
    width: 30,
    height: 30,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleText: {
    fontSize: wp(smLabelSize),
    marginTop: 5,
    marginHorizontal: 5
  },
  itemTitleText: {
    fontSize: wp(smLabelSize),
    flex: 1,
    fontFamily: FontFamily.title
  },
  itemValueText: {
    fontSize: wp(smLabelSize),
    flex: 1,
  },
  editButton: {
    fontSize: wp(smLabelSize),
    color: Color.clickableColor,
  },
  btnEditIcon: {
    color: Color.clickableColor,
    fontSize: wp('2.5%'),
    marginRight: 5,
    alignSelf: 'center',
    marginTop: -2
  }
});

export default ParticipantAccordionComponentStyles;