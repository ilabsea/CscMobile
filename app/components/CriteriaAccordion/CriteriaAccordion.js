import React, { Component } from 'react';
import { View, Text } from 'react-native';

import {Criteria} from '../../services/criteria_service';

class CriteriaAccordion extends Component {
  constructor(props) {
    super(props);
  }

  _renderAccordion() {
    const criterias = new Criteria(this.props.scorecardUuid).getCriterias();
    console.log('criterias ===== ', criterias);


    // return this.state.participants.map((participant, index) => {
    //   return (
    //     <List.Accordion
    //       key={uuidv4()}
    //       title={this.renderTitleText(participant)}
    //       style={{ backgroundColor: Color.whiteColor, borderBottomWidth: 1, borderColor: '#ebebeb' }}
    //       onPress={() => this._toggleAccordion(index)}
    //       expanded={this.state.accordionStatuses[index]}
    //     >
    //       { this._renderItem(participant) }
    //     </List.Accordion>
    //   )
    // });
  }

  render() {
    return (
      <View style={{ marginTop: 10 }}>

        { this._renderAccordion() }

        {/* <List.Section>
          { this._renderAccordion() }
        </List.Section> */}
      </View>
    )
  }
}

export default CriteriaAccordion;