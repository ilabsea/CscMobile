import { StyleSheet } from 'react-native';
import Color from '../../themes/color';
import { FontFamily } from '../../assets/stylesheets/theme/font';

const ParticipantAccordionComponentStyles = StyleSheet.create({
  orderNumberContainer: {
    backgroundColor: Color.lightGrayColor,
    width: 30,
    height: 30,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 3
  },
  titleText: {
    marginTop: 5,
    marginHorizontal: 5
  },
  itemTitleText: {
    flex: 1,
    fontFamily: FontFamily.title
  },
  itemValueText: {
    flex: 1,
  },
  editButton: {
    color: Color.clickableColor,
  },
  btnEditIcon: {
    color: Color.clickableColor,
    fontSize: 15,
    marginRight: 5,
    alignSelf: 'center',
    marginTop: -2
  }
});

export default ParticipantAccordionComponentStyles;