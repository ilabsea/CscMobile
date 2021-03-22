import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import { Icon } from 'native-base';
import Color from '../../themes/color';

import { LocalizationContext } from '../Translations';
import { TableWrapper, Cell } from 'react-native-table-component';
import indicatorHelper from '../../helpers/indicator_helper';

export default class ScorecardResultTableRow extends Component {
  static contextType = LocalizationContext;

  onPress = (fieldName, indicator) => {
    !!this.props.onPress && this.props.onPress(fieldName, indicator);
  }

  btnAdd = (fieldName, indicator) => {
    const { translations } = this.context;

    return (
      <TouchableOpacity onPress={() => this.onPress(fieldName, indicator)} style={{alignItems: 'center'}}>
        <View style={styles.btn}>
          <Text style={styles.btnText}>{ translations.addText }</Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderEditText = (fieldName, indicator) => {
    return (
      <View style={{flexDirection: 'row', padding: 6, alignItems: 'center', justifyContent: 'center'}}>
        <TouchableOpacity onPress={() => this.onPress(fieldName, indicator)} style={styles.btnEdit}>
          <Text style={{color: '#fff', marginRight: 6}}>{JSON.parse(this.props.criteria[fieldName]).length}</Text>
          <Icon name={'pen'} type="FontAwesome5" style={{color: '#fff', fontSize: 14}}/>
        </TouchableOpacity>
      </View>
    )
  }

  renderCell = (fieldName, indicator) => {
    if (!this.props.criteria[fieldName]) {
      return this.btnAdd(fieldName, indicator);
    }

    return this.renderEditText(fieldName, indicator);
  }

  _renderTextCell = (text, flexNum) => (
    <Cell data={text} textStyle={styles.text} style={{flex: flexNum}}/>
  );

  _renderMedian = () => (
    <Cell data={this.props.criteria.median} style={{flex: 2, alignItems: 'center'}}/>
  )

  render() {
    const editableFields = ['strength',  'weakness', 'suggested_action'];
    const indicator = indicatorHelper.getDisplayIndicator(this.props.criteria);

    return (
      <TableWrapper style={styles.row} borderStyle={{borderColor: '#c1c1c1', borderWidth: 1}}>
        { this._renderTextCell(indicator.content || indicator.name, 4) }
        { this._renderMedian() }
        { editableFields.map((fieldName, index) => (
          <Cell key={index} data={this.renderCell(fieldName, indicator)} textStyle={styles.text} style={{flex: 3}}/>
        ))}
      </TableWrapper>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1
  },
  text: {
    margin: 6,
    fontSize: 18
  },
  row: {
    flexDirection: 'row',
    minHeight: 80,
    backgroundColor: '#fff'
  },
  btn: {
    width: '85%',
    maxWidth: 90,
    height: 34,
    backgroundColor: '#cacaca',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  btnText: {
    textAlign: 'center',
    color: '#000',
    fontSize: 14,
  },
  btnEdit: {
    backgroundColor: Color.headerColor,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    borderRadius: 5,
  }
});
