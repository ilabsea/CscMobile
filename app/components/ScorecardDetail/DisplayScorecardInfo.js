import React, {Component} from 'react';
import {TextInput} from 'react-native-paper';
import {LocalizationContext} from '../../components/Translations';

class DisplayScorecardInfo extends Component {
  static contextType = LocalizationContext;
  render() {
    const {translations} = this.context;
    const {scorecardDetail} = this.props;
    const renderFields = [
      {label: 'year', fieldName: 'year'},
      {label: 'unitType', fieldName: 'unit_type'},
      {label: 'scorecardType', fieldName: 'scorecard_type'},
      {label: 'province', fieldName: 'province'},
      {label: 'district', fieldName: 'district'},
      {label: 'commune', fieldName: 'commune'},
      {label: 'implementer', fieldName: 'local_ngo_name'},
    ];

    return renderFields.map((renderField, index) => {
      let value = scorecardDetail[renderField.fieldName] != undefined ? scorecardDetail[renderField.fieldName].toString() : ''

      if (renderField.fieldName === 'scorecard_type')
        value = value === 'self_assessment' ? translations.selfAssessment : translations.communityScorecard;

      return (
        <TextInput
          label={translations[renderField.label]}
          mode="outlined"
          value={value}
          editable={false}
          style={{backgroundColor: 'white', width: '100%', marginTop: 20}}
          key={index}
        />
      );
    });
  }
}

export default DisplayScorecardInfo;