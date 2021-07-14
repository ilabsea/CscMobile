import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import AppIcon from 'react-native-vector-icons/FontAwesome';

import Color from '../../themes/color';

class FilterButton extends Component {
  render() {
    return (
      <TouchableOpacity>
        <AppIcon name="sliders" size={20} color={Color.whiteColor} style={{padding: 16}} />
      </TouchableOpacity>
    )
  }
}

export default FilterButton;