import React, {Component} from 'react';

import {
  View,
  Text,
  ScrollView,
  Alert,
} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import { LocalizationContext } from '../../components/Translations';
import ScorecardItem from '../../components/ScorecardItem';
import MessageModal from '../../components/MessageModal';
import NoDataMessage from '../../components/NoDataMessage';

import uuidv4 from '../../utils/uuidv4';
import Scorecard from '../../models/Scorecard';

import ScorecardService from '../../services/scorecardService';

import { connect } from 'react-redux';
import { set } from '../../actions/currentScorecardAction';

import { getDeviceStyle } from '../../utils/responsive_util';
import { mdLabelSize } from '../../constants/mobile_font_size_constant';
import scorecardHelper from '../../helpers/scorecard_helper';

class ScorecardList extends Component {
  static contextType = LocalizationContext;

  constructor(props) {
    super(props);

    this.state = {
      visibleModal: false,
      selectedScorecard: null,
      scorecards: Scorecard.getAll(),
      secPosition: 0,
      stickyHeaderIndex: 0,
    }
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener("focus", () => {
      this.setState({ scorecards: Scorecard.getAll() });
    });
  }

  componentWillUnmount() {
    this.focusListener();

    this.setState = (state, callback) => {
      return;
    };
  }

  renderList(scorecards) {
    return (scorecards.map((scorecard, index) => (
        <ScorecardItem
          key={uuidv4()}
          onPress={() => this.onPress(scorecard)}
          scorecard={scorecard}
          index={index}
          showDeleteModal={() => this.setState({ visibleModal: true, selectedScorecard: scorecard })}
        />
      )
    ));
  }

  renderScorecardList(scorecards) {
    const sortedScorecards = scorecardHelper.getSortedSubmittedScorecard(scorecards);

    return (
      <View key={uuidv4()}>
        <View>
          { this.renderList(sortedScorecards) }
        </View>
      </View>
    )
  }

  onPress(scorecard) {
    const { translations } = this.context

    if (scorecard.isDeleted) {
      return Alert.alert(translations.deletedScorecard, translations.theScorecardDeleted);
    }

    this.props.setCurrentScorecard(scorecard);
    this.props.navigation.navigate('ScorecardProgress', {uuid: scorecard.uuid, title: scorecard.displayName});
  }

  _renderNoData() {
    const { translations } = this.context

    return (
      <NoDataMessage
        title={translations.pleaseAddScorecard}
        buttonLabel={translations.startScorecard}
        onPress={() => this.props.navigation.reset({ index: 1, routes: [{ name: 'Home' }, {name: 'NewScorecard'}] })}
      />
    );
  }

  _confirmDelete() {
    const scorecardService = new ScorecardService();
    scorecardService.delete(this.state.selectedScorecard.uuid);

    this.setState({
      visibleModal: false,
      scorecards: Scorecard.getAll(),
      selectedScorecard: null,
    });
  }

  renderSectionTitle(title) {
    const titleSize = getDeviceStyle(16, wp(mdLabelSize));

    return (
      <View style={{backgroundColor: '#eee', paddingHorizontal: 16, paddingVertical: 10}}>
        <Text style={{fontSize: titleSize}}>
          { title }
        </Text>
      </View>
    )
  }

  render() {
    const { translations } = this.context;
    const progressScorecards = this.state.scorecards.filter(s => !s.finished);
    const finishedScorecards = this.state.scorecards.filter(s => (s.finished && !s.isUploaded));
    const submittedScorecards = this.state.scorecards.filter(s => s.isUploaded)
    const scorecardUuid = this.state.selectedScorecard ? this.state.selectedScorecard.uuid : '';

    if (!this.state.scorecards.length) {
      return this._renderNoData();
    }

    return (
      <View>
        <ScrollView contentContainerStyle={{backgroundColor: '#eee', flexGrow: 1, paddingBottom: 20}} stickyHeaderIndices={[0, 2, 4]}>
          { !!progressScorecards.length && this.renderSectionTitle(translations.progressScorecards) }
          { this.renderScorecardList(progressScorecards) }

          { !!finishedScorecards.length && this.renderSectionTitle(translations.completeScorecards) }
          { this.renderScorecardList(finishedScorecards) }

          { !!submittedScorecards.length && this.renderSectionTitle(translations.submittedScorecards) }
          { this.renderScorecardList(submittedScorecards) }
        </ScrollView>

        <MessageModal
          visible={this.state.visibleModal}
          onDismiss={() => this.setState({visibleModal: false})}
          description={translations.formatString(translations.doYouWantToDeleteThisScorecard, scorecardUuid)}
          hasConfirmButton={true}
          confirmButtonLabel={translations.ok}
          onPressConfirmButton={() => this._confirmDelete()}
        />
      </View>
    )
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    setCurrentScorecard: (scorecard) => dispatch(set(scorecard)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ScorecardList);
