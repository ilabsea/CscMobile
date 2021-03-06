import { StyleSheet } from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import { mobileHeadingTitleSize } from '../../utils/responsive_util';
import { xlLabelSize, lgLabelSize } from '../../constants/mobile_font_size_constant';

const RaisingProposedComponentStyles = StyleSheet.create({
  headingTitle: {
    fontSize: mobileHeadingTitleSize(),
  },
  criteriaValue: {
    fontSize: wp(lgLabelSize),
    marginTop: -1
  },
});

export default RaisingProposedComponentStyles;