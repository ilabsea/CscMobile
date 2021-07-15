import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Divider } from 'react-native-paper';
import AppIcon from 'react-native-vector-icons/FontAwesome';
import Color from '../../themes/color';
import { getDeviceStyle } from '../../utils/responsive_util';
import uuidv4 from '../../utils/uuidv4';

import scorecardHelper from '../../helpers/scorecard_helper';

class LocationList extends Component {
  constructor(props) {
    super(props);

    this.scorecardLocations = scorecardHelper.getScorecardLocations();

    this.state = {
      locations: this.scorecardLocations
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.searchedLocation != this.props.searchedLocation) {
      const newLocations = this.props.searchedLocation == '' ? this.getSortedLocation(this.scorecardLocations)
                          : this.scorecardLocations.filter(item => item.label.includes(this.props.searchedLocation));

      this.setState({locations: newLocations})
    }
  }

  onSelectItem(value) {
    this.props.onSelectItem('locations', value);

    let locations = this.state.locations;

    this.state.locations.map((location, index) => {
      if (location.label == value)
        locations[index].isSelected = !locations[index].isSelected;
    });

    this.setState({ locations: this.getSortedLocation(locations) });
  }

  getSortedLocation(locations) {
    if (!this.hasSelectedLocation(locations))
      return locations.sort((a, b) => a.label > b.label);

    return locations.sort((a, b) => (a.isSelected == b.isSelected) ? 0 : b.isSelected ? 1 : -1);
  }

  hasSelectedLocation(locations) {
    for (let i = 0; i < locations.length; i++) {
      if (locations[i].isSelected)
        return true;
    }

    return false;
  }

  renderList() {
    return this.state.locations.map((location, index) => {
      return (
        <View key={uuidv4()}>
          <TouchableOpacity onPress={() => this.onSelectItem(location.label)}
            style={{flexDirection: 'row', paddingRight: 25, paddingLeft: 30, paddingVertical: 10, alignItems: 'center'}}
          >
            <Text style={{flex: 1}}>{ location.label }</Text>

            { location.isSelected &&
              <AppIcon name='check-circle' size={24} color={Color.successColor} />
            }
          </TouchableOpacity>
          { index < this.state.locations.length - 1 && <Divider style={{backgroundColor: '#b3b3b3'}} /> }
        </View>
      )
    });
  }

  render() {
    return (
      <View style={{backgroundColor: Color.whiteColor}}>
        { this.renderList() }
      </View>
    )
  }
}

export default LocationList;