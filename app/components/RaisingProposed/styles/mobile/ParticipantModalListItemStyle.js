import { StyleSheet } from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { mdLabelSize, smLabelSize, mdIconSize } from '../../../../constants/mobile_font_size_constant';

const ParticipantModalListItemStyles = StyleSheet.create({
  genderIcon: {
    paddingHorizontal: 10,
    marginLeft: 0,
  },
  label: {
    margin: 0,
    fontSize: wp(smLabelSize),
  }
});

export default ParticipantModalListItemStyles;