import realm from '../db/schema';
import AsyncStorage from '@react-native-community/async-storage';
import Moment from 'moment';
import { DOWNLOADED, RUNNING, SUBMITTED } from '../constants/milestone_constant';
import scorecardHelper from '../helpers/scorecard_helper';

const Scorecard = (() => {
  return {
    getAll,
    find,
    update,
    upsert,
    destroy,
    isSubmitted,
    isExists,
    tourTipShown,
    hasUnsubmitted,
    getMilestone,
    getSubmittedExpired,
    getAllProvinces,
  }

  function getAll() {
    return realm.objects('Scorecard').sorted('downloaded_at', true);
  }

  function find(uuid) {
    return realm.objects('Scorecard').filtered(`uuid='${uuid}'`)[0];
  }

  function update(uuid, params={}) {
    realm.write(() => {
      realm.create('Scorecard', Object.assign(params, {uuid: uuid}), 'modified');
    })
  }

  function upsert(response) {
    AsyncStorage.setItem('SELECTED_SCORECARD_UUID', response.uuid);
    realm.write(() => {
      realm.create('Scorecard', _buildData(response), 'modified');
    });
  }

  function destroy(scorecardUuid) {
    let scorecard = find(scorecardUuid);

    realm.write(() => {
      realm.delete(scorecard);
    });
  }

  function isSubmitted(scorecardUuid) {
    const scorecard = find(scorecardUuid);

    return !!scorecard && scorecard.isUploaded;
  }

  function isExists(uuid) {
    return !!find(uuid);
  }

  function tourTipShown(uuid) {
    return find(uuid).tour_tip_shown;
  }

  function hasUnsubmitted() {
    const scorecards = realm.objects('Scorecard').filtered(`uploaded_date == null`);
    return scorecards.length > 0 ? true : false;
  }

  function getMilestone(scorecard) {
    if (!!scorecard.uploaded_date)
      return SUBMITTED;
    else if (scorecard.status < 2)
      return DOWNLOADED;
    else if (scorecard.status >= 2 && !scorecard.uploaded_date)
      return RUNNING;

    return '';
  }

  function getSubmittedExpired() {
    const scorecards = realm.objects('Scorecard').filtered('uploaded_date != null');
    let expiredScorecards = [];

    for (let i = 0; i < scorecards.length; i++) {
      const isAbleToRemove = scorecardHelper.isExpired(scorecards[i].uploaded_date);

      if (isAbleToRemove)
        expiredScorecards.push(scorecards[i]);
    }

    return expiredScorecards;
  }

  function getAllProvinces() {
    const scorecards = getAll();
    const provinces = [...new Set(scorecards.map(scorecard => scorecard.province))];

    return provinces;
  }

  // Private

  function _buildData(response) {
    return ({
      uuid: response.uuid,
      unit_type: response.unit_type_name,
      facility_id: response.facility_id,
      facility: response.facility != null ? JSON.stringify(response.facility) : '',
      facility_code: response.facility.code,
      scorecard_type: response.scorecard_type,
      name: response.name,
      description: response.description,
      year: response.year,
      local_ngo_name: response.local_ngo_name,
      local_ngo_id: response.local_ngo_id,
      province: response.province,
      district: response.district,
      commune: response.commune,
      program_id: response.program_id,
      downloaded_at: new Date(),
      primary_school: response.primary_school != null ? JSON.stringify(response.primary_school) : null,
    })
  }
})();

export default Scorecard;
