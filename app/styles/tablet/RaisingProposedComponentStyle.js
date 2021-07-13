import { StyleSheet } from 'react-native';
import Color from '../../themes/color';

const RaisingProposedComponentStyles = StyleSheet.create({
  headingTitle: {
    fontSize: 20,
  },
  criteriaValue: {
    fontSize: 16,
    marginTop: -2
  },
  filterBtn: {
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: Color.lightGrayColor
  },
  activeBtn: {
    backgroundColor: Color.clickableColor
  },
  btnText: {
    fontSize: 14
  },
  activeText: {
    color: Color.whiteColor
  }
});

export default RaisingProposedComponentStyles;