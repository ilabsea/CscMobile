import { ERROR_SCORECARD_COMPLETED, ERROR_SCORECARD_EXECUTED } from '../constants/error_constant';
import Moment from 'moment';
import moment from "moment/min/moment-with-locales";
import { environment } from '../config/environment';
// import { SCORECARD_RESULT } from '../constants/scorecard_step_constant';
import { selfAssessment } from '../constants/scorecard_constant';
import Color from '../themes/color';

const DATE_FORMAT = 'ddd MMM DD YYYY';

const scorecardHelper = (() => {
  return {
    isScorecardAvailable,
    getScorecardErrorType,
    isExpired,
    getTranslatedRemoveDate,
    getStatusIcon,
    getSortedSubmittedScorecard,
    iconColor,
    iconBorderColor,
  };

  function isScorecardAvailable(scorecard) {
    return !scorecard.progress || scorecard.progress == 'downloaded';
  }

  function getScorecardErrorType(scorecard) {
    if (!scorecard.progress)
      return '';
    else if (scorecard.progress == 'submitted')
      return ERROR_SCORECARD_COMPLETED;

    return ERROR_SCORECARD_EXECUTED;
  }

  function isExpired(uploadedDate) {
    const submittedDate = Moment(uploadedDate, DATE_FORMAT);

    return Moment().diff(submittedDate, 'days') >= environment.removeScorecardDay ? true : false;
  }

  function getTranslatedRemoveDate(uploadedDate, locale) {
    let expiredDate = Moment(uploadedDate, DATE_FORMAT).add(environment.removeScorecardDay, 'days');
    expiredDate = Moment(expiredDate).format('YYYY-MM-DD');

    return moment(expiredDate).locale(locale).format('LL');
  }

  function getStatusIcon(scorecard) {
    if (scorecard.isUploaded)
      return 'lock';
    else if (scorecard.finished)
      return 'check';

    return 'hourglass-half';
  }

  function getSortedSubmittedScorecard(scorecards) {
    return scorecards.sort((a, b) => (a.isUploaded === b.isUploaded) ? 0 : a.isUploaded ? 1 : -1);
  }

  function iconColor(scorecard) {
    if (scorecard.isUploaded)
      return Color.lightGrayColor;
    else if (scorecard.finished)
      return Color.successColor;

    return Color.clickableColor;
  }

  function iconBorderColor(scorecard) {
    if (scorecard.scorecard_type == selfAssessment)
      return Color.lightBlueColor;

    return Color.clickableColor;
  }
})();

export default scorecardHelper;