import realm from '../db/schema';
import uuidv4 from '../utils/uuidv4';
import ImagePicker from 'react-native-image-crop-picker';

const MODEL_NAME = 'ScorecardImage'

const ScorecardImage = (() => {
  return {
    create,
    destroy,
    findByScorecard,
    hasItem,
  }

  function create(data) {
    realm.write(() => {
      realm.create(MODEL_NAME, _buildData(data));
    });
  }

  function destroy(scorecardUuid, filePath) {
    const image = realm.objects(MODEL_NAME).filtered(`scorecard_uuid = '${scorecardUuid}' AND image_path = '${filePath}'`);

    if(image) {
      realm.write(() => {
        realm.delete(image);
      });

      ImagePicker.cleanSingle(filePath);
    }
  }

  function findByScorecard(scorecardUuid) {
    return realm.objects(MODEL_NAME).filtered(`scorecard_uuid = '${scorecardUuid}'`);
  }

  function hasItem(scorecardUuid) {
    return realm.objects(MODEL_NAME).filtered(`scorecard_uuid = '${scorecardUuid}'`).length > 0 ? true : false;
  }

  // private method
  function _buildData(data) {
    return {
      uuid: uuidv4(),
      scorecard_uuid: data.scorecard_uuid,
      image_path: data.image_path,
    }
  }
})();

export default ScorecardImage;