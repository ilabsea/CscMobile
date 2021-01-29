'use strict';

class Scorecard {
  get isCompleted() {
    return this.status == '5';
  }

  get isUploaded() {
    return !!this.uploaded_date;
  }

  get isDeleted() {
    return !!this.deleted_date;
  }

  get isSameLanguageCode() {
    return this.audio_language_code == this.text_language_code;
  }

  get displayName() {
    let scorecard_type = {community_scorecard: 'CS', self_assessment: 'SA'}[this.scorecard_type];

    return `${this.uuid} (${this.commune}-${this.district}-${this.province}-${this.year}-${this.facility}-${scorecard_type})`;
  }
}

Scorecard.schema = {
  name: 'Scorecard',
  primaryKey: 'uuid',
  properties: {
    uuid: 'string',
    unit_type: 'string',
    facility_id: 'int',
    facility: 'string',
    scorecard_type: 'string',
    name: 'string',
    description: 'string?',
    year: 'int',
    conducted_date: 'string?',
    number_of_caf: 'int?',
    number_of_participant: { type: 'int?', default: 0 },
    number_of_female: { type: 'int?', default: 0 },
    number_of_disability: { type: 'int?', default: 0 },
    number_of_ethnic_minority: { type: 'int?', default: 0 },
    number_of_youth: { type: 'int?', default: 0 },
    number_of_id_poor: { type: 'int?', default: 0 },
    status: { type: 'string', default: '1' },
    local_ngo_name: 'string',
    local_ngo_id: 'int',
    province: 'string',
    district: 'string',
    commune: 'string',
    program_id: 'int',
    uploaded_date: 'string?',
    downloaded: { type: 'bool', default: false },
    text_language_code: 'string?',
    audio_language_code: 'string?',
    deleted_date: 'string?',
    finished: { type: 'bool', default: false },
  }
}

export default Scorecard;
