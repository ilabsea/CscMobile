import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {Container} from "native-base";
import BigHeader from '../../components/BigHeader';
import {LocalizationContext} from '../../components/Translations';
import DisplayScorecardInfo from '../../components/ScorecardDetail/DisplayScorecardInfo';
import BottomButton from '../../components/BottomButton';
import Scorecard from '../../models/Scorecard';
import { getSubTitleFontSize } from '../../utils/responsive_util';

class ScorecardDetail extends Component {
  static contextType = LocalizationContext;
  constructor(props) {
    super(props);

    this.state = {
      scorecard: Scorecard.find(props.route.params.scorecard_uuid),
    };
  }

  startScorecard = () => {
    this.props.navigation.navigate('ScorecardPreference', {
      scorecard_uuid: this.props.route.params.scorecard_uuid,
      local_ngo_id: this.state.scorecard.local_ngo_id
    });
  }

  _renderHeader() {
    const {translations} = this.context;
    const title = `${translations.scorecardApp} - ${this.props.route.params.scorecard_uuid}`;

    return (
      <BigHeader
        title={translations.welcomeTo}
        bigTitle={title}
        onBackPress={() => this.props.navigation.goBack()}/>
    )
  }

  render() {
    const {translations} = this.context;

    return (
      <Container>
        {this._renderHeader()}

        <ScrollView contentContainerStyle={styles.container}>
          <Text style={{fontSize: getSubTitleFontSize(), marginBottom: -10}}>{translations.pleaseCheckScorecardDetailBelow}</Text>
          <DisplayScorecardInfo scorecardDetail={this.state.scorecard}/>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <BottomButton label={translations.start} onPress={() => this.startScorecard()} />
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 24,
    paddingBottom: 28,
  },
  buttonContainer: {
    padding: 20
  },
});

export default ScorecardDetail;
