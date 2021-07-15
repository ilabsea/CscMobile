import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Input, Item, Icon } from 'native-base';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import Color from '../../themes/color';
import { FontFamily } from '../../assets/stylesheets/theme/font';
import { getDeviceStyle } from '../../utils/responsive_util';
import { mdLabelSize } from '../../constants/mobile_font_size_constant';

import { LocalizationContext } from '../../components/Translations';

class LocationSearchBox extends Component {
  static contextType = LocalizationContext;

  render() {
    const { translations } = this.context;

    return (
      <View style={styles.container}>
        <Item rounded style={[styles.inputContainer, this.props.searchedLocation ? { marginRight: 15 } : {}]}>
          <Icon name="search" style={{fontSize: 22, paddingLeft: 10, paddingRight: 0, marginTop: 0, color: Color.grayColor}} />
          <Input
            placeholder={ translations.searchLocation }
            value={this.props.searchedLocation}
            clearButtonMode='always'
            style={[styles.searchInput, !!this.props.searchedLocation ? { marginRight: 10 } : {}]}
            onChangeText={(text) => this.props.onChangeText(text)}
          />
        </Item>

        { !!this.props.searchedLocation &&
          <TouchableOpacity onPress={() => this.props.onClearSearch()} style={{justifyContent: 'center'}}>
            <Icon name="close" style={{fontSize: 28, paddingLeft: 0, paddingRight: 0, marginTop: 0, color: Color.grayColor}} />
          </TouchableOpacity>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    borderRadius: 10,
    borderColor: Color.grayColor,
    flex: 1,
    backgroundColor: Color.paleGrayColor
  },
  container: {
    backgroundColor: Color.whiteColor,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: Color.paleGrayColor,
    flexDirection: 'row',
  },
  searchInput: {
    fontFamily: FontFamily.body,
    fontSize: getDeviceStyle(16, wp(mdLabelSize)),
    width: '100%',
    paddingTop: 0,
    paddingBottom: 0,
  }
});

export default LocationSearchBox;