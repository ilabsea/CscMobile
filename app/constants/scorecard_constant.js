// Download phases of scorecard contain indicator, language_indicator, caf,
// rating_scale, program_language, lang_indicator_audio, lang_rating_scale_audio, and indicator_image
const scorecardDownloadSteps = 6;

const cafPhase = 1;
const ratingScalePhase = 2;
const indicatorPhase = 3;
const languageIndicatorPhase = 4;
const langIndicatorAudioPhase = 5;
const langRatingScaleAudioPhase = 6;
const indicatorImagePhase = 7;

const scorecardDownloadPhases = {
  1: 'failed',
  2: 'failed',
  3: 'failed',
  4: 'failed',
  5: 'failed',
  6: 'failed',
}

const selfAssessment = 'self_assessment';
const commnunityScorecard =  'community_scorecard';

export {
  scorecardDownloadPhases,
  indicatorPhase,
  languageIndicatorPhase,
  cafPhase,
  ratingScalePhase,
  langIndicatorAudioPhase,
  langRatingScaleAudioPhase,
  indicatorImagePhase,
  scorecardDownloadSteps,
  selfAssessment,
  commnunityScorecard
};