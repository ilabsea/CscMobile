'use strict';

const IndicatorSchema = {
  name: 'Indicator',
  primaryKey: 'id',
  properties: {
    id: 'int',
    name: 'string',
    facility_id: 'int',
    scorecard_uuid: 'string'
  },
};

export default IndicatorSchema;
